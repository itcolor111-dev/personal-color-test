// src/data/questions_female.js
const questionsFemale = [
  {
    id: 1,
    group: "wc",
    text: {
      ko: "당신의 눈동자 색깔은 어떤 색에 가깝나요?",
      en: "Which eye color is closest to yours?",
      zh: "你的瞳孔颜色更接近哪一种？",
      ja: "あなたの瞳の色はどれに近いですか？",
    },
    answers: [
      {
        text: {
          ko: "옐로우 브라운, 다크 브라운, 올리브 그린, 웜 블루",
          en: "Yellow brown, dark brown, olive green, warm blue",
          zh: "黄棕色、深棕色、橄榄绿、暖蓝色",
          ja: "イエローブラウン、ダークブラウン、オリーブグリーン、ウォームブルー",
        },
        score: { warm: 1 },
      },
      {
        text: {
          ko: "레드 브라운, 블랙, 쿨 블루, 보라",
          en: "Red brown, black, cool blue, purple",
          zh: "红棕色、黑色、冷蓝色、紫色",
          ja: "レッドブラウン、ブラック、クールブルー、パープル",
        },
        score: { cool: 1 },
      },
    ],
    next: () => 2,
  },
  {
    id: 2,
    group: "wc",
    text: {
      ko: "머리카락 색은 어떤 색에 가깝나요?",
      en: "Which hair color is closer to yours?",
      zh: "你的头发颜色更接近哪一种？",
      ja: "髪の色はどちらに近いですか？",
    },
    answers: [
      {
        text: { ko: "갈색에 가까운 편이다", en: "Closer to brown", zh: "更接近棕色", ja: "茶色に近い" },
        score: { warm: 1 },
      },
      {
        text: { ko: "검은색에 가까운 편이다", en: "Closer to black", zh: "更接近黑色", ja: "黒に近い" },
        score: { cool: 1 },
      },
    ],
    next: () => 3,
  },
  {
    id: 3,
    group: "wc",
    text: {
      ko: "여름 햇빛에 노출되었을 때 피부톤이 어떻게 바뀌나요?",
      en: "How does your skin tone change after summer sun exposure?",
      zh: "夏天晒太阳后，你的肤色通常会怎样变化？",
      ja: "夏に日差しを浴びると肌トーンはどう変わりますか？",
    },
    answers: [
      {
        text: {
          ko: "빨갛게 익은 후 다시 원래 피부톤으로 돌아온다.",
          en: "Turns red first, then returns to the original tone.",
          zh: "先晒红，然后会恢复到原来的肤色。",
          ja: "赤く日焼けしてから元の肌色に戻る。",
        },
        score: { cool: 1 },
        goto: 4,
      },
      {
        text: {
          ko: "까맣게 탄 후 시간이 좀 지나야 원래의 피부톤으로 돌아온다.",
          en: "Tans darker, and takes time to return to the original tone.",
          zh: "会晒黑，需要一段时间才恢复到原来的肤色。",
          ja: "黒く焼けて、元に戻るまで時間がかかる。",
        },
        score: { warm: 1 },
        goto: 5,
      },
    ],
    next: (i) => questionsFemale[2].answers[i].goto,
  },

  {
    id: 4,
    group: "wc",
    text: {
      ko: "어떤 색의 옷을 입었을 때 얼굴이 가장 건강하고 생기 있어 보이나요?",
      en: "Which clothing color makes your face look healthiest and most lively?",
      zh: "穿哪种颜色的衣服时，你的气色看起来最健康有精神？",
      ja: "どの色の服を着ると一番健康的で生き生き見えますか？",
    },
    answers: [
      {
        text: { ko: "오렌지레드의 옷", en: "Orange-red clothing", zh: "橙红色的衣服", ja: "オレンジレッドの服" },
        score: { warm: 1 },
        goto: 6,
      },
      {
        text: { ko: "와인 레드의 옷", en: "Wine-red clothing", zh: "酒红色的衣服", ja: "ワインレッドの服" },
        score: { cool: 1 },
        goto: 7,
      },
    ],
    next: (i) => questionsFemale[3].answers[i].goto,
  },
  {
    id: 5,
    group: "wc",
    text: {
      ko: "어울린다고 생각하는 립스틱의 컬러는 무엇인가요?",
      en: "Which lipstick color do you think suits you best?",
      zh: "你觉得最适合你的口红颜色是？",
      ja: "似合うと思うリップの色はどちらですか？",
    },
    answers: [
      {
        text: {
          ko: "살구, 코랄, 오렌지 계열",
          en: "Apricot / coral / orange tones",
          zh: "杏色 / 珊瑚 / 橙色系",
          ja: "アプリコット／コーラル／オレンジ系",
        },
        score: { warm: 1 },
        goto: 7,
      },
      {
        text: { ko: "핑크, 로즈, 모브 계열", en: "Pink / rose / mauve tones", zh: "粉色 / 玫瑰 / 藕紫系", ja: "ピンク／ローズ／モーブ系" },
        score: { cool: 1 },
        goto: 8,
      },
    ],
    next: (i) => questionsFemale[4].answers[i].goto,
  },
  {
    id: 6,
    group: "wc",
    text: {
      ko: "평소 더 잘 어울린다고 느끼는 액세서리 계열은 무엇인가요?",
      en: "Which accessory tone feels more flattering on you?",
      zh: "你觉得自己更适合哪种配饰色调？",
      ja: "普段、より似合うと感じるアクセサリーの系統は？",
    },
    answers: [
      {
        text: { ko: "골드 14k, 18K ,24k, 로즈골드 계열", en: "Gold (14K, 18K, 24K) and rose gold tones", zh: "14K、18K、24K 黄金及玫瑰金系列", ja: "14K・18K・24K ゴールド、ローズゴールド系" },
        score: { warm: 1 },
        goto: 9,
      },
      {
        text: { ko: "실버, 화이트골드 계열", en: "Silver / white gold", zh: "银色 / 白金色", ja: "シルバー／ホワイトゴールド" },
        score: { cool: 1 },
        goto: 7,
      },
    ],
    next: (i) => questionsFemale[5].answers[i].goto,
  },
  {
    id: 7,
    group: "wc",
    text: {
      ko: "화이트 계열 중 어떤 색이 더 잘 어울리나요?",
      en: "Which white tone suits you better?",
      zh: "在白色系中，你更适合哪一种？",
      ja: "白系の中ではどちらがより似合いますか？",
    },
    answers: [
      {
        text: { ko: "따뜻한 아이보리", en: "Warm ivory", zh: "温暖的象牙白", ja: "温かみのあるアイボリー" },
        score: { warm: 1 },
        goto: 9,
      },
      {
        text: { ko: "선명한 퓨어 화이트", en: "Crisp pure white", zh: "干净的纯白", ja: "はっきりしたピュアホワイト" },
        score: { cool: 1 },
        goto: 10,
      },
    ],
    next: (i) => questionsFemale[6].answers[i].goto,
  },
  {
    id: 8,
    group: "wc",
    text: {
      ko: "평소 잘 어울린다고 느끼는 패션 배색은 무엇인가요?",
      en: "Which outfit color combination feels more flattering?",
      zh: "你觉得更适合你的穿搭配色是？",
      ja: "普段似合うと感じるファッション配色は？",
    },
    answers: [
      {
        text: { ko: "카라멜 코트 + 그린 머플러", en: "Caramel coat + green muffler", zh: "焦糖色外套 + 绿色围巾", ja: "キャラメルコート＋グリーンのマフラー" },
        score: { warm: 1 },
        goto: 7,
      },
      {
        text: { ko: "네이비 코트 + 그레이 머플러", en: "Navy coat + Gray muffler", zh: "海军蓝外套 + 灰色围巾", ja: "ネイビーコート＋グレーのマフラー" },
        score: { cool: 1 },
        goto: 10,
      },
    ],
    next: (i) => questionsFemale[7].answers[i].goto,
  },

  {
    id: 9,
    group: "type",
    text: {
      ko: "잘 어울린다고 느끼는 노란색 계열은 무엇인가요?",
      en: "Which yellow tone feels more flattering?",
      zh: "你更适合哪种黄色系？",
      ja: "似合うと感じるイエローはどちらですか？",
    },
    answers: [
      {
        text: { ko: "밝은 병아리 노란색", en: "Bright chick yellow", zh: "明亮的小鸡黄", ja: "明るいひよこイエロー" },
        score: { type: "WSP", add: 1 },
        goto: 11,
      },
      {
        text: { ko: "채도가 낮은 겨자색", en: "Muted mustard", zh: "低饱和的芥末黄", ja: "彩度低めのマスタード" },
        score: { type: "WAU", add: 1 },
        goto: 12,
      },
    ],
    next: (i) => questionsFemale[8].answers[i].goto,
  },
  {
    id: 10,
    group: "type",
    text: {
      ko: "어떤 주얼리·시계 스타일이 당신에게 더 잘 어울린다고 느끼시나요?",
      en: "Which jewelry/watch style feels more flattering on you?",
      zh: "你觉得哪种首饰/手表风格更适合你？",
      ja: "どのジュエリー／時計のスタイルがより似合うと感じますか？",
    },
    answers: [
      {
        text: { ko: "작고 심플한 디자인", en: "Small & simple design", zh: "小巧简约的设计", ja: "小さくてシンプル" },
        score: { type: "CS", add: 1 },
        goto: 13,
      },
      {
        text: { ko: "크고 화려한 디자인", en: "Big & glamorous design", zh: "大气华丽的设计", ja: "大きくて華やか" },
        score: { type: "CW", add: 1 },
        goto: 14,
      },
    ],
    next: (i) => questionsFemale[9].answers[i].goto,
  },
  {
    id: 11,
    group: "type",
    text: {
      ko: "밝은 파스텔 톤의 옷을 입으면 어떤 느낌이 드나요?",
      en: "How do you look in light pastel clothing?",
      zh: "穿浅色粉彩衣服时感觉如何？",
      ja: "明るいパステルの服を着るとどう感じますか？",
    },
    answers: [
      {
        text: { ko: "얼굴이 화사하고 윤기 있어 보인다", en: "My face looks brighter and more radiant.", zh: "脸色更明亮、有光泽。", ja: "顔が明るくツヤが出て見える。" },
        score: { type: "WSP", add: 1 },
        goto: 15,
      },
      {
        text: { ko: "얼굴과 따로 놀고 탁해 보인다", en: "It looks separate and makes me look dull.", zh: "不融合，显得暗沉。", ja: "浮いて見えて、くすんだ印象になる。" },
        score: { type: "WAU", add: 1 },
        goto: 15,
      },
    ],
    next: () => 15,
  },
  {
    id: 12,
    group: "type",
    text: {
      ko: "어두운 색 톤의 옷을 입으면 어떤 느낌이 드나요?",
      en: "How do you look in darker-toned clothing?",
      zh: "穿深色系衣服时感觉如何？",
      ja: "暗めトーンの服を着るとどう見えますか？",
    },
    answers: [
      {
        text: { ko: "이목구비가 또렷해지고 피부가 정돈되어 보인다", en: "My features look sharper and my skin looks more refined.", zh: "五官更清晰，皮肤更干净利落。", ja: "目鼻立ちがはっきりして肌が整って見える。" },
        score: { type: "WAU", add: 1 },
        goto: 15,
      },
      {
        text: { ko: "얼굴이 어두워 보이고 피곤해 보인다", en: "My face looks darker and more tired.", zh: "脸色变暗，更显疲惫。", ja: "顔色が暗く見えて疲れて見える。" },
        score: { type: "WSP", add: 1 },
        goto: 15,
      },
    ],
    next: () => 15,
  },
  {
    id: 13,
    group: "type",
    text: {
      ko: "색조 메이크업을 강하게 했을 때 어떤 느낌인가요?",
      en: "How do you look with strong color makeup?",
      zh: "画浓重彩妆时你看起来如何？",
      ja: "しっかりめの色メイクをするとどう見えますか？",
    },
    answers: [
      { text: { ko: "촌스러워 보인다", en: "It looks tacky on me.", zh: "会显得俗气。", ja: "野暮ったく見える。" }, score: { type: "CS", add: 1 }, goto: 15 },
      { text: { ko: "화려하고 세련된 느낌이 난다", en: "It looks glamorous and chic.", zh: "会显得华丽又时髦。", ja: "華やかで洗練された印象になる。" }, score: { type: "CW", add: 1 }, goto: 15 },
    ],
    next: () => 15,
  },
  {
    id: 14,
    group: "type",
    text: {
      ko: "검은색 옷을 입었을 때 어떤 느낌이 드나요?",
      en: "How do you look in black clothing?",
      zh: "穿黑色衣服时你看起来如何？",
      ja: "黒い服を着るとどう見えますか？",
    },
    answers: [
      { text: { ko: "이목구비가 선명하고 피부가 정리되어 보인다", en: "My features look sharper and my skin looks clearer.", zh: "五官更立体，皮肤更干净。", ja: "目鼻立ちがはっきりして肌が整って見える。" }, score: { type: "CW", add: 1 }, goto: 15 },
      { text: { ko: "얼굴에 그늘이 져서 피곤해 보인다", en: "It creates shadows on my face and makes me look tired.", zh: "脸上有阴影，看起来更疲惫。", ja: "影が出て疲れて見える。" }, score: { type: "CS", add: 1 }, goto: 15 },
    ],
    next: () => 15,
  },

  {
    id: 15,
    group: "final",
    text: {
      ko: "평소 주변에서 당신이 자주 듣는 말은 무엇인가요?",
      en: "Lastly, which overall image feels closest to you?",
      zh: "最后，你整体给人的感觉更接近哪一种？",
      ja: "最後に、全体的な印象はどれに近いですか？",
    },
    answers: [
      { text: { ko: "사랑스럽다, 생기 있어 보인다", en: "People say I look lovely and energetic.", zh: "别人说我很可爱、有活力。", ja: "愛らしくて、生き生きしていると言われます。" }, score: { type: "WSP", add: 1 } },
      { text: { ko: "차분하다, 단정하고 이지적으로 보인다", en: "People say I look calm, neat, and intellectual.", zh: "别人说我看起来沉稳、端正、理性。", ja: "落ち着いていて、きちんとしていて、知的だと言われます。" }, score: { type: "CS", add: 1 } },
      { text: { ko: "건강미가 느껴진다, 분위기 있다", en: "People say I look healthy and have presence.", zh: "别人说我很有健康美，也很有气质。", ja: "健康的で、雰囲気があると言われます。" }, score: { type: "WAU", add: 1 } },
      { text: { ko: "세련되다, 시크하다", en: "People say I look stylish and chic.", zh: "别人说我时尚、有型。", ja: "洗練されていて、クールだと言われます。" }, score: { type: "CW", add: 1 } },
    ],
    next: () => null,
  },
];

export default questionsFemale;
