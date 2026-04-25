// src/data/questions_male.js
import questionsFemale from "./questions_female.js";

// ✅ 함수(next)는 유지되고, text/answers/score는 새 객체로 복사
const questionsMale = questionsFemale.map((q) => ({
  ...q,
  text: { ...q.text },
  answers: q.answers.map((a) => ({
    ...a,
    text: { ...a.text },
    score: a.score ? { ...a.score } : a.score,
  })),
}));

// 5번 남자용 문항
questionsMale[4].text = {
  ko: "어울린다고 생각하는 모자 컬러는 무엇인가요?",
  en: "Which hat color do you think suits you best?",
  zh: "你认为最适合你的帽子颜色是什么？",
  ja: "自分に似合うと思う帽子の色はどれですか？",
};

questionsMale[4].answers = [
  {
    text: { ko: "오렌지레드, 아쿠아블루", en: "Orange-red / aqua blue", zh: "橙红 / 水蓝", ja: "オレンジレッド／アクアブルー" },
    score: { warm: 1 },
    goto: 7,
  },
  {
    text: { ko: "버건디레드, 네이비", en: "Burgundy red / navy", zh: "酒红 / 海军蓝", ja: "バーガンディ／ネイビー" },
    score: { cool: 1 },
    goto: 8,
  },
];
questionsMale[4].next = (i) => questionsMale[4].answers[i].goto;

// 13번 남자용 문항
questionsMale[12].text = {
  ko: "선명한 색의 머플러를 했을 때 어떤 느낌이 드나요?",
  en: "How do you look with a vivid-colored muffler?",
  zh: "戴鲜艳颜色围巾时你看起来如何？",
  ja: "鮮やかな色のマフラーをするとどう見えますか？",
};

questionsMale[12].answers = [
  { text: { ko: "촌스러워 보인다", en: "It looks tacky on me.", zh: "会显得俗气。", ja: "野暮ったく見える。" }, score: { type: "CS", add: 1 }, goto: 15 },
  { text: { ko: "포인트 컬러로 세련된 느낌이 난다", en: "It looks stylish as a statement color.", zh: "作为点缀色很时髦。", ja: "差し色としておしゃれに見える。" }, score: { type: "CW", add: 1 }, goto: 15 },
];
questionsMale[12].next = () => 15;

export default questionsMale;
