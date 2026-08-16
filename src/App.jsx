import { useEffect, useMemo, useRef, useState } from "react";
import "./index.css";
import "./App.css";

import questionsFemale from "./data/questions_female";
import questionsMale from "./data/questions_male";
import { AGE_OPTIONS, CONFIG, JOB_OPTIONS, LANGS, UI, RESULT_PAGE, RESULT_VIEW_I18N } from "./data/meta";


function buildAnswersText(answersMap, qMap, lang) {
  const out = {};
  Object.entries(answersMap).forEach(([qidStr, aIdx]) => {
    const qid = Number(qidStr);
    const q = qMap.get(qid);
    const ans = q?.answers?.[aIdx];
    out[`Q${qid}`] = ans?.text?.[lang] ?? "";
  });
  return out; // { Q1:"...", Q2:"...", ... }
}

function buildKoQaColumns(qMap, answersMap) {
  const out = {};
  for (let qid = 1; qid <= 15; qid++) {
    const q = qMap.get(qid);
    const answerIdx = answersMap[qid];

    out[`Q${qid}_질문`] = q?.text?.ko ?? "";
    out[`Q${qid}_답변`] =
      answerIdx === undefined ? "" : (q?.answers?.[answerIdx]?.text?.ko ?? "");
  }
  return out;
}

function buildShownMeta(history, lastQid) {
  // history에는 "이전에 풀었던 질문들"이 들어있고,
  // 결과가 나는 시점(lastQid)은 history에 아직 안 들어있으니 붙여줌.
  // ✅ 중복 방지까지 포함
  const shownQids = Array.from(new Set([...history, lastQid]));

  return {
    shownQids, // [1,2,3,5,...]
    shownCount: shownQids.length,
    path: shownQids.join("→"),
    shownQidsCsv: shownQids.join(","), // 시트에서 보기 편하게
  };
}

function calcMinStepsFrom(qMap, startId) {
  const memo = new Map();

  function dfs(qid, guard = new Set()) {
    if (qid == null) return 0; // 이미 끝

    if (memo.has(qid)) return memo.get(qid);
    if (guard.has(qid)) return 999; // 혹시라도 무한루프 방지

    const q = qMap.get(qid);
    if (!q) return 1;

    guard.add(qid);

    // 각 답변을 골랐다고 가정했을 때의 다음 질문 id를 전부 계산해서 "최소"를 취함
    const nextSteps = (q.answers || []).map((a, idx) => {
      const nextId = a?.goto ?? q.next(idx);
      if (nextId == null) return 1; // 현재 질문이 마지막이면 1
      return 1 + dfs(nextId, new Set(guard));
    });

    const best = nextSteps.length ? Math.min(...nextSteps) : 1;
    memo.set(qid, best);
    return best;
  }

  return dfs(startId);
}



/** -----------------------------
 *  점수/결과 계산
 * ------------------------------ */
function makeEmptyScores() {
  return { WSP: 0, WAU: 0, CS: 0, CW: 0 };
}

function applyScore(scores, rule) {
  if (!rule) return;

  // 1~8 warm/cool → 4타입으로 분배
  if (rule.warm) {
    scores.WSP += rule.warm;
    scores.WAU += rule.warm;
  }
  if (rule.cool) {
    scores.CS += rule.cool;
    scores.CW += rule.cool;
  }

  // 9~15 type 직접 가산
  if (rule.type && rule.add) {
    scores[rule.type] += rule.add;
  }
}

function resolveType(scores, answersMap) {
  const entries = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const topScore = entries[0][1];
  const tied = entries.filter((e) => e[1] === topScore).map((e) => e[0]);
  if (tied.length === 1) return tied[0];

  // Q15 tie-break 우선
  const q15 = answersMap[15];
  if (q15 !== undefined) {
    const pick = ["WSP", "CS", "WAU", "CW"][q15];
    if (tied.includes(pick)) return pick;
  }

  // warm/cool 합으로 fallback
  const warmSum = scores.WSP + scores.WAU;
  const coolSum = scores.CS + scores.CW;
  if (warmSum >= coolSum) return scores.WSP >= scores.WAU ? "WSP" : "WAU";
  return scores.CW >= scores.CS ? "CW" : "CS";
}

/** -----------------------------
 *  AI 팁 (풀세트)
 *  - ko: 원문 그대로 (절대 수정 없음)
 *  - en: 캐주얼 톤
 *  - ja: 설명형 톤
 *  - zh: 마케팅 톤
 * ------------------------------ */
export const AI_TIPS = {
  /* ===================== 한국어 (원문 그대로) ===================== */
  ko: {
    WSP: {
      icon: "🌸",
      title: "WARM SPRING",
      content: `추천 컬러: 아이보리, 라이트 옐로우, 코랄/피치, 연두색, 병아리색, 오렌지, 오렌지레드 포인트
주얼리 : 14k, 18k, 로즈골드 등 골드계열 주얼리, 아이보리 진주
피하기: 회색이 섞인 탁한 컬러 또는 검은색이 섞인 어두운 컬러 차가운 실버, 푸른 기 도는 화이트

✨스타일링 tip✨
- 얼굴주변에 당신의 퍼스널 컬러로 밝혀주세요.
- 헤어, 메이크업, 주얼리, 머플러, 스카프, 안경테, 상의 등
- 어울리지 않으나 좋아하는 색은 얼굴 바깥쪽(하의, 바지, 자켓, 가방 등)으로 사용하세요.`,
      female:
        "블랙 원피스나 어두운 상의를 입을 때, 봄웜톤 컬러의 스카프나 골드계열 주얼리를 매치해 얼굴의 화사함을 지켜주세요.",
      male:
        "무채색의 니트, 니트, 셔츠나 외투를 입을 때, 봄웜톤 컬러의 머플러나 이너(티셔츠, 셔츠 등)를 레이어드하여 안색을 생기 있게 연출해 보세요.",
    },

    WAU: {
      icon: "🍁",
      title: "WARM AUTUMN",
      content: `추천 컬러: 머스타드, 올리브그린, 카멜/브라운, 테라코타, 딥 포레스트 그린, 펌킨
주얼리 : 무광 24k 골드, 빈티지주얼리, 원석, 베이지계열의 진주
피하기: 흰색이 많이 섞인 라이트 파스텔컬러, 형광색 또는 비비드한 컬러, 마젠타 핑크, 쨍한 블루

✨스타일링 tip✨
- 얼굴주변에 당신의 퍼스널 컬러로 밝혀주세요.
- 헤어, 메이크업, 주얼리, 머플러, 스카프, 안경테, 상의 등
- 어울리지 않으나 좋아하는 색은 얼굴 바깥쪽(하의, 바지, 자켓, 가방 등)으로 사용하세요.`,
      female:
        "블랙 원피스나 차가운 계열의 상의를 입을 때, 가을웜톤 컬러의 스카프나 볼드한 골드계열 주얼리를 매치해 얼굴의 우아한 깊이감을 표현해 보세요.",
      male:
        "형광색이나 쨍한 원색의 니트, 셔츠나 외투를 입을 때, 가을웜톤 컬러의 머플러나 이너(티셔츠, 셔츠 등)를 레이어드하여 차분한 분위기를 밸런스있게 잡아주세요.",
    },

    CS: {
      icon: "🍀",
      title: "COOL SUMMER",
      content: `추천 컬러: 라벤더, 더스티 블루, 라이트 그레이, 소프트 핑크, 민트그린, 스카이 블루
주얼리: 실버, 화이트골드, 로즈골드, 화이트진주, 투명한 큐빅
피하기: 오렌지 레드, 강한 원색 대비, 노란 기 도는 골드, 카키, 카멜


✨스타일링 tip✨
- 얼굴주변에 당신의 퍼스널 컬러로 밝혀주세요.
- 헤어, 메이크업, 주얼리, 머플러, 스카프, 안경테, 상의 등
- 어울리지 않으나 좋아하는 색은 얼굴 바깥쪽(하의, 바지, 자켓, 가방 등)으로 사용하세요.`,
      female:
        "노란 기가 도는 컬러를 상의를 입을 때, 여름 쿨톤 컬러의  스카프나 실버 주얼리를 활용해 여름 쿨톤 특유의 맑은 우아한 무드를 유지하세요.",
      male:
        "노란색이 가미된 베이지나 카멜, 올리브그린 색의 니트,셔츠나 외투를 입을 때,  여름쿨톤 컬러의 머플러나 이너(티셔츠, 셔츠 등)를 레이어드하여 시원하고 지적인 인상을 완성해 보세요.",
    },

    CW: {
      icon: "❄️",
      title: "COOL WINTER",
      content: `추천 컬러: 블랙&화이트 명도대비, 코발트/딥네이비, 쿨레드, 로열 퍼플, 에메랄드 그린 등
주얼리 : 화이트골드, 티타늄, 흑진주, 백진주, 볼드한 실버, 플래티넘, 다이아몬드
피하기: 회색이 섞인 탁한 파스텔, 오렌지 계열, 골드 소재, 브라운

✨스타일링 tip✨
- 얼굴주변에 당신의 퍼스널 컬러로 밝혀주세요.
- 헤어, 메이크업, 주얼리, 머플러, 스카프, 안경테, 상의 등
- 어울리지 않으나 좋아하는 색은 얼굴 바깥쪽(하의, 바지, 자켓, 가방 등)으로 사용하세요.`,
      female:
        "노란색이 가미된 탁한 파스텔톤을 상의를 입을 때, 겨울쿨톤 컬러의 스카프나 볼드한 실버계열 주얼리를 매치해 시크하고 도도함을 살려주세요.",
      male:
        "노란색이 가미된 탁한 파스텔톤의 니트, 셔츠나 외투를 입을 때, 겨울쿨톤 컬러의 머플러나 이너(티셔츠, 셔츠 등)를 레이어드하여 시크하고 도시적인 이미지를 강조해보세요.",
    },
  },

  /* ===================== 영어 (캐주얼) ===================== */
  en: {
    WSP: {
      icon: "🌸",
      title: "WARM SPRING",
      content: `Best colors: ivory, light yellow, coral/peach, light green, chick yellow, orange, orange-red accents
Jewelry: 14k, 18k, rose gold (gold tones), ivory pearls
Avoid: muted grayish shades, dark colors mixed with black, cool silver, bluish whites

✨Styling tip✨
- Brighten the area around your face with your personal colors.
- Hair, makeup, jewelry, mufflers, scarves, glasses frames, tops, etc.
- If you love a color but it doesn’t suit you, use it away from the face (bottoms, pants, jackets, bags, etc.).`,
      female:
        "When you wear a black dress or a darker top, match a spring-warm scarf or gold-toned jewelry to keep your face looking fresh and bright.",
      male:
        "When you wear neutral knits/shirts/outerwear, layer a spring-warm muffler or inner top (tee/shirt) to make your complexion look lively.",
    },

    WAU: {
      icon: "🍁",
      title: "WARM AUTUMN",
      content: `Best colors: mustard, olive green, camel/brown, terracotta, deep forest green, pumpkin
Jewelry: matte 24k gold, vintage jewelry, gemstones, beige-toned pearls
Avoid: light pastels with lots of white, neon or overly vivid colors, magenta pink, super bright blues

✨Styling tip✨
- Brighten the area around your face with your personal colors.
- Hair, makeup, jewelry, mufflers, scarves, glasses frames, tops, etc.
- If you love a color but it doesn’t suit you, use it away from the face (bottoms, pants, jackets, bags, etc.).`,
      female:
        "If you’re wearing a black dress or a cooler-toned top, add an autumn-warm scarf or bold gold jewelry to bring out that elegant depth.",
      male:
        "When you’re in neon or super-bright tops, balance it out with an autumn-warm muffler or inner layer (tee/shirt) for a calmer, more grounded vibe.",
    },

    CS: {
      icon: "🍀",
      title: "COOL SUMMER",
      content: `Best colors: lavender, dusty blue, light gray, soft pink, mint green, sky blue
Jewelry: silver, white gold, rose gold, white pearls, clear cubic zirconia
Avoid: orange red, strong primary-color contrast, yellowish gold, khaki, camel

✨Styling tip✨
- Brighten the area around your face with your personal colors.
- Hair, makeup, jewelry, mufflers, scarves, glasses frames, tops, etc.
- If you love a color but it doesn’t suit you, use it away from the face (bottoms, pants, jackets, bags, etc.).`,
      female:
        "When you wear a top with a yellow undertone, use a cool-summer scarf or silver jewelry to keep that clear, elegant summer-cool mood.",
      male:
        "With beige/camel/olive pieces that lean yellow, layer a cool-summer muffler or inner top (tee/shirt) to finish a crisp, smart impression.",
    },

    CW: {
      icon: "❄️",
      title: "COOL WINTER",
      content: `Best colors: high-contrast black & white, cobalt/deep navy, cool red, royal purple, emerald green, etc.
Jewelry: white gold, titanium, black pearls, white pearls, bold silver, platinum, diamonds
Avoid: muted grayish pastels, orange tones, gold materials, brown

✨Styling tip✨
- Brighten the area around your face with your personal colors.
- Hair, makeup, jewelry, mufflers, scarves, glasses frames, tops, etc.
- If you love a color but it doesn’t suit you, use it away from the face (bottoms, pants, jackets, bags, etc.).`,
      female:
        "When you wear muted pastels with a yellow cast, match a winter-cool scarf or bold silver jewelry to keep it chic and sharp.",
      male:
        "With muted pastel knits/shirts/outerwear that lean yellow, layer a winter-cool muffler or inner top (tee/shirt) to emphasize a sleek, city look.",
    },
  },

  /* ===================== 일본어 (설명형) ===================== */
  ja: {
    WSP: {
      icon: "🌸",
      title: "ウォームスプリング",
      content: `おすすめカラー：アイボリー、ライトイエロー、コーラル／ピーチ、ライトグリーン、ひよこ色、オレンジ、オレンジレッド（ポイント）
ジュエリー：14k、18k、ローズゴールドなどゴールド系、アイボリー系パール
避けたい色：グレーが混ざったくすみ色、ブラック混じりの暗い色、冷たい印象のシルバー、青みのあるホワイト

✨スタイリング tip✨
- 顔周りをあなたのパーソナルカラーで明るく見せてください。
- ヘア、メイク、ジュエリー、マフラー、スカーフ、メガネフレーム、トップスなど
- 似合いにくいけれど好きな色は、顔から離れた位置（ボトムス、パンツ、ジャケット、バッグなど）で使うとバランスが取りやすいです。`,
      female:
        "ブラックのワンピースや暗めのトップスを着るときは、春ウォーム系のスカーフやゴールド系ジュエリーを合わせて、顔色の華やかさを保つようにしてください。",
      male:
        "無彩色のニット／シャツ／アウターを着るときは、春ウォーム系のマフラーやインナー（Tシャツ、シャツなど）を重ねて、顔色をいきいき見せるようにしてください。",
    },

    WAU: {
      icon: "🍁",
      title: "ウォームオータム",
      content: `おすすめカラー：マスタード、オリーブグリーン、キャメル／ブラウン、テラコッタ、ディープフォレストグリーン、パンプキン
ジュエリー：マットな24kゴールド、ヴィンテージジュエリー、天然石、ベージュ系パール
避けたい色：白が多く混ざったライトパステル、蛍光色やビビッドすぎる色、マゼンタピンク、強いブルー

✨スタイリング tip✨
- 顔周りをあなたのパーソナルカラーで明るく見せてください。
- ヘア、メイク、ジュエリー、マフラー、スカーフ、メガネフレーム、トップスなど
- 似合いにくいけれど好きな色は、顔から離れた位置（ボトムス、パンツ、ジャケット、バッグなど）で使うとバランスが取りやすいです。`,
      female:
        "ブラックのワンピースや冷たい印象のトップスを着るときは、秋ウォーム系のスカーフやボリュームのあるゴールド系ジュエリーを合わせて、上品な深みを表現してみてください。",
      male:
        "蛍光色や強い原色のニット／シャツ／アウターを着るときは、秋ウォーム系のマフラーやインナー（Tシャツ、シャツなど）を重ねて、落ち着いた雰囲気に整えるようにしてください。",
    },

    CS: {
      icon: "🍀",
      title: "クールサマー",
      content: `おすすめカラー：ラベンダー、ダスティブルー、ライトグレー、ソフトピンク、ミントグリーン、スカイブルー
ジュエリー：シルバー、ホワイトゴールド、ローズゴールド、ホワイトパール、透明感のあるキュービック
避けたい色：オレンジレッド、強い原色コントラスト、黄みのあるゴールド、カーキ、キャメル

✨スタイリング tip✨
- 顔周りをあなたのパーソナルカラーで明るく見せてください。
- ヘア、メイク、ジュエリー、マフラー、スカーフ、メガネフレーム、トップスなど
- 似合いにくいけれど好きな色は、顔から離れた位置（ボトムス、パンツ、ジャケット、バッグなど）で使うとバランスが取りやすいです。`,
      female:
        "黄みを感じるトップスを着るときは、サマークール系のスカーフやシルバージュエリーを活用して、澄んだ上品な雰囲気を保つようにしてください。",
      male:
        "ベージュ／キャメル／オリーブグリーンなど黄み寄りのニット・シャツ・アウターを着るときは、サマークール系のマフラーやインナー（Tシャツ、シャツなど）を重ねて、爽やかで知的な印象に仕上げてください。",
    },

    CW: {
      icon: "❄️",
      title: "クールウィンター",
      content: `おすすめカラー：ブラック＆ホワイトの明度コントラスト、コバルト／ディープネイビー、クールレッド、ロイヤルパープル、エメラルドグリーンなど
ジュエリー：ホワイトゴールド、チタン、黒真珠、白真珠、ボリュームのあるシルバー、プラチナ、ダイヤモンド
避けたい色：グレーが混ざったくすみパステル、オレンジ系、ゴールド素材、ブラウン

✨スタイリング tip✨
- 顔周りをあなたのパーソナルカラーで明るく見せてください。
- ヘア、メイク、ジュエリー、マフラー、スカーフ、メガネフレーム、トップスなど
- 似合いにくいけれど好きな色は、顔から離れた位置（ボトムス、パンツ、ジャケット、バッグなど）で使うとバランスが取りやすいです。`,
      female:
        "黄みが混ざったくすみパステルのトップスを着るときは、ウィンタークール系のスカーフやボリュームのあるシルバー系ジュエリーを合わせて、クールで洗練された印象を引き立ててください。",
      male:
        "黄みが混ざったくすみパステルのニット／シャツ／アウターを着るときは、ウィンタークール系のマフラーやインナー（Tシャツ、シャツなど）を重ねて、都会的でシャープなイメージを強調してください。",
    },
  },

  /* ===================== 중국어 (마케팅 톤) ===================== */
  zh: {
    WSP: {
      icon: "🌸",
      title: "暖春型",
      content: `推荐颜色：象牙白、浅黄色、珊瑚色/蜜桃色、浅绿色、嫩黄、橙色、橙红色点缀
珠宝：14k、18k、玫瑰金等金色系珠宝、象牙色珍珠
避免：带灰的浑浊色、混黑的深色、冷银色、偏蓝的白色

✨造型 tip✨
- 用你的个人色点亮脸部周围的区域。
- 发型、妆容、珠宝、围巾/披巾、眼镜框、上衣等都很关键。
- 不适合但喜欢的颜色，建议放在远离脸部的位置（下装、裤子、外套、包等）使用。`,
      female:
        "穿黑色连衣裙或深色上衣时，搭配暖春色围巾或金色系珠宝，让脸部更显明亮有气色。",
      male:
        "穿无彩色针织/衬衫/外套时，叠搭暖春色围巾或内搭（T恤、衬衫等），让气色更精神更有活力。",
    },

    WAU: {
      icon: "🍁",
      title: "暖秋型",
      content: `推荐颜色：芥末黄、橄榄绿、驼色/棕色、陶土色、深森林绿、南瓜色
珠宝：哑光24k金、复古珠宝、天然石、米色系珍珠
避免：大量混白的浅马卡龙色、荧光色或过于鲜艳的颜色、洋红粉、亮度很高的蓝色

✨造型 tip✨
- 用你的个人色点亮脸部周围的区域。
- 发型、妆容、珠宝、围巾/披巾、眼镜框、上衣等都很关键。
- 不适合但喜欢的颜色，建议放在远离脸部的位置（下装、裤子、外套、包等）使用。`,
      female:
        "穿黑色连衣裙或偏冷调上衣时，选择暖秋色围巾或大气的金色系珠宝，立刻呈现优雅的深邃质感。",
      male:
        "穿荧光色或高饱和原色上衣时，叠搭暖秋色围巾或内搭（T恤、衬衫等），把整体氛围稳稳拉回高级感。",
    },

    CS: {
      icon: "🍀",
      title: "冷夏型",
      content: `推荐颜色：薰衣草紫、雾霾蓝、浅灰、柔粉、薄荷绿、天空蓝
珠宝：银色、白金、玫瑰金、白色珍珠、通透立方氧化锆
避免：橙红色、强烈原色对比、偏黄的金色、卡其、驼色

✨造型 tip✨
- 用你的个人色点亮脸部周围的区域。
- 发型、妆容、珠宝、围巾/披巾、眼镜框、上衣等都很关键。
- 不适合但喜欢的颜色，建议放在远离脸部的位置（下装、裤子、外套、包等）使用。`,
      female:
        "穿带黄调的上衣时，搭配冷夏色围巾或银色珠宝，维持冷夏特有的清透优雅氛围。",
      male:
        "穿偏黄调的米色/驼色/橄榄绿针织、衬衫或外套时，叠搭冷夏色围巾或内搭（T恤、衬衫等），打造清爽又显得很聪明的印象。",
    },

    CW: {
      icon: "❄️",
      title: "冷冬型",
      content: `推荐颜色：黑白高对比、钴蓝/深海军蓝、冷调红、皇家紫、祖母绿等
珠宝：白金、钛金属、黑珍珠、白珍珠、夸张银饰、铂金、钻石
避免：带灰的浑浊马卡龙色、橙色系、金色材质、棕色

✨造型 tip✨
- 用你的个人色点亮脸部周围的区域。
- 发型、妆容、珠宝、围巾/披巾、眼镜框、上衣等都很关键。
- 不适合但喜欢的颜色，建议放在远离脸部的位置（下装、裤子、外套、包等）使用。`,
      female:
        "穿带黄感的浑浊马卡龙色上衣时，搭配冷冬色围巾或夸张银饰，一秒拉满冷冽高级与气场。",
      male:
        "穿带黄感的浑浊马卡龙色针织、衬衫或外套时，叠搭冷冬色围巾或内搭（T恤、衬衫等），突出利落的都市感与酷感。",
    },
  },
};

/** -----------------------------
 *  AI 팁 텍스트 생성
 *  - 아이콘으로 결과 표시
 *  - "여성 tip :", "남성 tip :" 라벨 고정
 *  - 결과/추천컬러 사이, 피하기/스타일링tip 사이에 여백 유지
 * ------------------------------ */
function makeAiTip(type, gender, lang) {
  // 번역이 혹시 빠져도 ko로 fallback
  const t = AI_TIPS?.[lang]?.[type] ?? AI_TIPS?.ko?.[type];
  if (!t) return "";

  const tipLabel = gender === "male" ? "남성 tip : " : "여성 tip : ";
  const genderTip = gender === "male" ? t.male : t.female;

  // content는 원문 줄바꿈 그대로 유지
  // 원하는 여백: "결과" 다음 한 줄 띄움, content 내부에서 이미 섹션 간 줄바꿈 포함
  return [
    `${t.icon} 결과: ${t.title}`,
    "",
    t.content,
    "",
    `${tipLabel}${genderTip}`,
  ].join("\n");
}


export default function App() {
  const busyRef = useRef(false);
  const [lang, setLang] = useState("ko");

  // 인트로 화면 여부
  const [intro, setIntro] = useState(true);

  // 오프닝
  const [gender, setGender] = useState(null); // "female" | "male"
  const [age, setAge] = useState("");
  const [job, setJob] = useState("");

  // 진행
  const [started, setStarted] = useState(false);
  const [currentId, setCurrentId] = useState(1);
  const [history, setHistory] = useState([]);
  const [answers, setAnswers] = useState({});
  const [scores, setScores] = useState(makeEmptyScores());
  const [resultType, setResultType] = useState(null);

  // 결과/모달
  const [savingText, setSavingText] = useState("");
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiTip, setAiTip] = useState("");

  const [shownQids, setShownQids] = useState([]);
  const [path, setPath] = useState("");


  const questions = useMemo(
    () => (gender === "male" ? questionsMale : questionsFemale),
    [gender]
  );

  const qMap = useMemo(() => {
    const m = new Map();
    questions.forEach((q) => m.set(q.id, q));
    return m;
  }, [questions]);

  const currentQ = useMemo(() => qMap.get(currentId), [qMap, currentId]);


  useEffect(() => {
    // 결과 이미지
    ["WSP", "WAU", "CS", "CW"].forEach((t) => {
      const img = new Image();
      img.src = `/result/result_${t}.jpg`;
    });

    // 질문 이미지 1~9 (각 2개 선택지)
    for (let q = 1; q <= 9; q++) {
      for (let a = 1; a <= 2; a++) {
        const img = new Image();

        // Q5만 성별 폴더
        if (q === 5) {
          if (!gender) continue; // gender 아직 선택 전이면 스킵
          img.src = `/q/${gender === "male" ? "m" : "f"}/q5_a${a}.jpg`;
        } else {
          img.src = `/q/q${q}_a${a}.jpg`;
        }
      }
    }
  }, [gender]);

  useEffect(() => {
    if (!started || resultType || !currentQ) return;
    if (currentQ.id > 9) return; // 10~15는 이미지 없음

    currentQ.answers.forEach((_, idx) => {
      const img = new Image();
      const isQ5 = currentQ.id === 5;

      img.src = isQ5
        ? `/q/${gender === "male" ? "m" : "f"}/q5_a${idx + 1}.jpg`
        : `/q/q${currentQ.id}_a${idx + 1}.jpg`;
    });
  }, [started, resultType, currentQ, gender]);



  const t = UI[lang];
  const rt = RESULT_PAGE[lang];
  const isValidPick = (v) => v && v !== "-" && v !== "—";
  const canStart = !!gender && isValidPick(age) && isValidPick(job);


  const total = 15;

  // 이미 답한 질문 수 (분기/뒤로가기에도 가장 안전)
  const answeredCount = history.length;

  // ✅ 현재 질문부터 "끝까지 최소 몇 문항 남았는지"
  const remainingMin = useMemo(() => {
    if (!started || resultType) return 0;
    return calcMinStepsFrom(qMap, currentId);
  }, [started, resultType, qMap, currentId]);

  // ✅ 분기 경로 기준 총 문항 수
  const totalDynamic =
    started && !resultType ? answeredCount + remainingMin : 0;

  // ✅ 현재 문항 포함해서 진행률 계산
  const progressCount =
    started && !resultType ? answeredCount + 1 : 0;

  const progress =
    started && !resultType && totalDynamic > 0
      ? Math.round((progressCount / totalDynamic) * 100)
      : 0;





  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  async function saveToSheet(payload) {
    if (!CONFIG.SHEETS_WEBAPP_URL) {
      setSavingText("⚠️ VITE_SHEETS_WEBAPP_URL이 비어 있어요(.env / Netlify 환경변수 설정 필요)");
      return;
    }

    setSavingText(t.saving);

    try {
      const body = {
        ...payload,
        userAgent: navigator.userAgent,
      };

      const res = await fetch(CONFIG.SHEETS_WEBAPP_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" }, // ✅ 핵심
        body: JSON.stringify(body),
      });

      const text = await res.text();
      if (!res.ok) throw new Error(text);

      setSavingText(t.saved);
    } catch (e) {
      console.error("saveToSheet error:", e);
      setSavingText(`${t.saveFail}\n${String(e?.message ?? e)}`);
    }
  }

  function resetAll() {
    setStarted(false);
    setCurrentId(1);
    setHistory([]);
    setAnswers({});
    setScores(makeEmptyScores());
    setResultType(null);
    setSavingText("");
    setAiTip("");
    setAiModalOpen(false);
    setShownQids([]);
    setPath("");
  }

  function startQuiz() {
    if (!canStart) return;
    setStarted(true);
    setCurrentId(1);
    setHistory([]);
    setAnswers({});
    setScores(makeEmptyScores());
    setResultType(null);
    setSavingText("");
    setAiTip("");
    setAiModalOpen(false);
    setShownQids([]);
    setPath("");
  }

  function chooseAnswer(answerIndex) {
    const q = currentQ;
    if (!q) return;

    // ✅ 방어: 답변 인덱스가 잘못 들어오면 종료
    const chosen = q.answers?.[answerIndex];
    if (!chosen) return;

    // ✅ 중복 클릭 방지(아주 중요)
    if (busyRef.current) return;
    busyRef.current = true;

    try {
      // ✅ 1) 로컬에서 다음 answers 계산 (이 값으로 nextId/resolveType 계산까지 다 함)
      const nextAnswers = { ...answers, [q.id]: answerIndex };

      // ✅ 2) 로컬에서 다음 scores 계산
      const nextScores = { ...scores };
      applyScore(nextScores, chosen.score);

      // ✅ 3) 상태 반영은 "함수형 업데이트"로 (경쟁 상태 안전)
      setAnswers((prev) => ({ ...prev, [q.id]: answerIndex }));
      setScores((prev) => {
        const next = { ...prev };
        applyScore(next, chosen.score);
        return next;
      });

      // ✅ 4) 다음 질문 id 계산
      const nextId = chosen.goto ?? q.next(answerIndex);

      // ✅ 5) 종료면 결과 계산/저장
      if (nextId === null) {
        const type = resolveType(nextScores, nextAnswers);
        setResultType(type);

        // ✅ A안: 15문항 고정 컬럼
        const koQa = buildKoQaColumns(qMap, nextAnswers);

        // ✅ A안: 실제 노출 질문/경로 메타
        const meta = buildShownMeta(history, q.id); // q.id = 마지막으로 답한 질문 id(대부분 15)

        // state에도 저장해두면, aiTip 이벤트에서도 같은 경로로 남길 수 있음
        setShownQids(meta.shownQids);
        setPath(meta.path);

        saveToSheet({
          timestamp: new Date().toISOString(),
          event: "result",
          lang,
          savedLang: "ko",
          gender,
          age,
          job,

          // 원본 데이터
          answers: nextAnswers,
          scores: nextScores,
          resultType: type,
          aiTip: "",

          // ✅ 메타(분석/디버깅용)
          shownCount: meta.shownCount,
          shownQids: meta.shownQidsCsv, // "1,2,3,5,8..."
          path: meta.path,              // "1→2→3→5→8..."

          // ✅ 15문항 고정 컬럼
          ...koQa,
        });

        return;
      }


      // ✅ 6) 다음 질문으로 이동
      setHistory((prev) => [...prev, q.id]);
      setCurrentId(nextId);
    } finally {
      requestAnimationFrame(() => { busyRef.current = false; });
    }

  }

  function openAiTip() {
    if (!resultType) return;
    const tip = makeAiTip(resultType, gender, lang);
    setAiTip(tip);
    setAiModalOpen(true);

    const koQa = buildKoQaColumns(qMap, answers);
    const meta = buildShownMeta(history, history[history.length - 1] ?? 15);

    saveToSheet({
      timestamp: new Date().toISOString(),
      event: "aiTip",
      lang,
      savedLang: "ko",
      gender,
      age,
      job,
      answers,
      scores,
      resultType,
      aiTip: tip,
      shownCount: meta.shownCount,
      shownQids: meta.shownQidsCsv,
      path: meta.path,
      ...koQa,
    });
  }


  function goBack() {
    if (history.length === 0) return;

    const newHistory = [...history];
    const prevId = newHistory.pop();

    const keep = new Set([...newHistory, prevId]);
    const filteredAnswers = {};
    Object.keys(answers).forEach((k) => {
      const id = Number(k);
      if (keep.has(id)) filteredAnswers[id] = answers[id];
    });

    const recalced = makeEmptyScores();
    [...newHistory, prevId].forEach((id) => {
      const q = qMap.get(id);
      const idx = filteredAnswers[id];
      if (!q || idx === undefined) return;
      applyScore(recalced, q.answers[idx].score);
    });

    setHistory(newHistory);
    setCurrentId(prevId);
    setAnswers(filteredAnswers);
    setScores(recalced);
  }

  function shareKakaoOrWeb() {
    const shareUrl =
      "https://itcolor111-dev.github.io/personal-color-test/";

    const isMobile =
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    // ✅ PC에서는 카카오 로그인창 띄우지 않고 링크 복사
    if (!isMobile) {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(shareUrl)
          .then(() => {
            alert(
              "퍼스널컬러 테스트 링크가 복사되었습니다.\n카카오톡 PC에 붙여넣어 공유해주세요."
            );
          })
          .catch(() => {
            prompt("아래 링크를 복사해주세요.", shareUrl);
          });
      } else {
        prompt("아래 링크를 복사해주세요.", shareUrl);
      }

      return;
    }

    // ✅ 모바일에서는 카카오톡 공유
    const Kakao = window.Kakao;

    if (!Kakao) {
      alert("카카오 공유 기능을 불러오지 못했습니다.");
      return;
    }

    if (!Kakao.isInitialized()) {
      Kakao.init("9ff20a1696ae4c43eccf9f6d0447fc80");
    }

    Kakao.Share.sendDefault({
      objectType: "feed",

      content: {
        title: "나의 퍼스널컬러 찾기",
        description: "1분 만에 나의 퍼스널컬러를 찾아보세요 🎨",

        imageUrl:
          "https://itcolor111-dev.github.io/personal-color-test/brand/itcolor_logo.png",

        link: {
          mobileWebUrl: shareUrl,
          webUrl: shareUrl,
        },
      },

      buttons: [
        {
          title: "퍼스널컬러 테스트하기",

          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
      ],
    });
  }

  const view = resultType ? RESULT_VIEW_I18N?.[resultType] : null;

  return (
    <div className={`page ${intro ? "introOn" : ""}`}>
      <div className="bg" />

      <div className="container">
        {!intro && (
          <header className="header">
            <div className="logoWrap">
              <img className="logo" src={CONFIG.LOGO_PATH} alt="logo" />
            </div>
            <div>
              <h1 className="title">{t.title}</h1>
              <p className="sub">{t.sub}</p>
            </div>
          </header>
        )}

        <section className="card">

          {/* INTRO SCREEN */}
          {intro && !started && !resultType && (
            <div className="introWrap">
              <div className="introCard">
                <div className="introTop">
                  <div className="introBrand">
                    <img
                      className="introLogo"
                      src={CONFIG.INTRO_LOGO_PATH}
                      alt="ITCOLOR"
                      loading="eager"
                      decoding="async"
                      fetchPriority="high"
                    />

                  </div>

                  <h1 className="introTitle">나의 퍼스널컬러 찾기</h1>

                  <p className="introDesc">
                    1분 만에 찾는 나의 퍼스널 컬러!<br />
                    이미 16만 명 이상이 자신의 색을 찾았습니다.<br />
                    스타일링 팁부터 시그니처 굿즈까지 만나보세요.
                  </p>
                </div>

                <div className="introBars">
                  <div className="introBar warmSpring">
                    <div className="introBarKo">웜톤 봄</div>
                    <div className="introBarEn">Warm Spring</div>
                  </div>

                  <div className="introBar coolSummer">
                    <div className="introBarKo">쿨톤 여름</div>
                    <div className="introBarEn">Cool Summer</div>
                  </div>

                  <div className="introBar warmAutumn">
                    <div className="introBarKo">웜톤 가을</div>
                    <div className="introBarEn">Warm Autumn</div>
                  </div>

                  <div className="introBar coolWinter">
                    <div className="introBarKo">쿨톤 겨울</div>
                    <div className="introBarEn">Cool Winter</div>
                  </div>
                </div>

                <button
                  type="button"
                  className="introStartBtn"
                  onClick={() => setIntro(false)}
                >
                  START👆🏻
                </button>
              </div>
            </div>
          )}


          {/* START */}
          {!intro && !started && !resultType && (
            <div className="stack">
              <div className="row">
                <div className="label">{t.lang}</div>
                <select className="select" value={lang} onChange={(e) => setLang(e.target.value)}>
                  {LANGS.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid">
                <div className="block">
                  <div className="blockTitle">{t.gender}</div>
                  <div className="chips">
                    <button type="button" className={`chip ${gender === "female" ? "active" : ""}`} onClick={() => setGender("female")}>
                      {t.female}
                    </button>
                    <button type="button" className={`chip ${gender === "male" ? "active" : ""}`} onClick={() => setGender("male")}>
                      {t.male}
                    </button>

                  </div>
                </div>

                <div className="block">
                  <div className="blockTitle">{t.age}</div>
                  <select className="select" value={age} onChange={(e) => setAge(e.target.value)}>
                    <option value="">-</option>
                    {AGE_OPTIONS[lang].map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="block">
                  <div className="blockTitle">{t.job}</div>
                  <select className="select" value={job} onChange={(e) => setJob(e.target.value)}>
                    <option value="">-</option>
                    {JOB_OPTIONS[lang].map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button type="button" className="btn primary" disabled={!canStart} onClick={startQuiz}>
                {t.start}
              </button>

            </div>
          )}

          {/* QUIZ */}
          {started && !resultType && currentQ && (
            <div className="stack">
              <div className="progress">
                <div className="progressBar" style={{ width: `${progress}%` }} />
              </div>

              <div className="qTop">
                {/* 질문 번호 표시 안 하려면 아래처럼 id 출력은 제거됨 */}
                <div className="qText">{currentQ.text[lang]}</div>
              </div>

              {/* ✅ 답 개수만큼 이미지 자동 표시: /public/q/q{질문번호}_a{선택지번호}.jpg */}
              <div className="answers">
                {currentQ.answers.map((a, idx) => {
                  const showImage = currentQ.id <= 9; // ✅ 1~9만 이미지, 10~15는 텍스트만
                  const isQ5 = currentQ.id === 5;
                  const base = import.meta.env.BASE_URL;

                  const imgSrc = isQ5
                    ? `${base}q/${gender === "male" ? "m" : "f"}/q5_a${idx + 1}.jpg`
                    : `${base}q/q${currentQ.id}_a${idx + 1}.jpg`;

                  return (
                    <button
                      type="button"
                      key={idx}
                      className={`answerBtn ${showImage ? "answerWithImg" : "answerTextOnly"}`}
                      onClick={() => chooseAnswer(idx)}
                    >
                      {showImage && (
                        <div className="answerImgWrap">
                          <img
                            className="answerImg"
                            src={imgSrc}
                            alt={`q${currentQ.id} option ${idx + 1}`}
                            loading="lazy"
                            decoding="async"
                          />


                        </div>
                      )}

                      <div className="answerText">{a.text[lang]}</div>
                    </button>
                  );
                })}

              </div>

              <div className="navRow">
                <button type="button" className="btn ghost" onClick={goBack} disabled={history.length === 0}>
                  {t.back}
                </button>
                <button type="button" className="btn ghost" onClick={resetAll}>
                  {t.restart}
                </button>
              </div>
            </div>
          )}

          {/* RESULT (다국어) */}
          {resultType && view && (
            <div className="stack resultLayout">
              <div className="resultHeaderSmall">{rt.yourResultIs}</div>
              <div className="resultBigTitle">{view.title[lang]}</div>

              <div className={`toneCard ${resultType}`}>
                <img
                  className="toneBgImage"
                  src={`${import.meta.env.BASE_URL}result/result_${resultType}.jpg`}
                  alt={`${resultType} result`}
                  loading="eager"
                  decoding="async"
                  onError={(e) => {
                    console.log("❌ result image not found:", e.currentTarget.src);
                    e.currentTarget.style.display = "none";
                  }}
                />



                <div className="toneOverlay">
                  <div className="toneEn">{view.title.en}</div>
                </div>
              </div>

              <div className="resultParagraph">
                <div className="resultStrong">
                  {view.desc[lang].strong}
                </div>

                {view.desc[lang].body.split("\n").map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>


              <div className="paletteBlock">
                <div className="paletteTitle">{rt.paletteTitle}</div>
                <div className="paletteRow">
                  {view.palette.map((c, i) => (
                    <div key={i} className="paletteDot" style={{ background: c }} />
                  ))}
                </div>
              </div>

              <div className="celebBlock">
                <div className="celebTitle">{rt.celebTitle}</div>
                <div className="celebNames">{view.celebs[lang]}</div>
              </div>

              <button
                type="button"
                className="btn primary bigBtn"
                onClick={openAiTip}
              >
                {rt.aiTipBtn}
              </button>

              <a
                className="btn ghost bigBtn youtubeBtn"
                href="https://youtube.com/@colorboratorys?si=YI0caDRkIJ5gtiJ5"
                target="_blank"
                rel="noreferrer"
              >
                <span className="ytIcon">▶</span>
                컬러보레이터 이윤설 유튜브채널
              </a>

              <a
                className="btn ghost bigBtn productBtn"
                href={CONFIG.PRODUCT_URL}
                target="_blank"
                rel="noreferrer"
              >
                {rt.productBtn}
              </a>

              <a
                className="btn ghost bigBtn courseBtn"
                href={CONFIG.COURSE_URL}
                target="_blank"
                rel="noreferrer"
              >
                {rt.courseBtn}
              </a>


              <button type="button" className="btn kakaoBtn bigBtn" onClick={shareKakaoOrWeb}>
                {rt.shareBtn}
              </button>

              <button type="button" className="btn retryBtn bigBtn" onClick={resetAll}>
                {rt.retryBtn}
              </button>

              <div className="fineprint">{savingText}</div>
            </div>
          )}
        </section>
      </div>

      {/* AI MODAL */}
      {aiModalOpen && (
        <div className="modal" onClick={() => setAiModalOpen(false)}>
          <div className="modalCard" onClick={(e) => e.stopPropagation()}>
            <div className="modalHead">
              <div className="modalTitle">{rt.aiModalTitle}</div>
              <button type="button" className="xBtn" onClick={() => setAiModalOpen(false)}>
                ×
              </button>

            </div>
            <div className="modalBody">
              <pre className="aiText">{aiTip}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
