// src/data/meta.js
export const CONFIG = {
    SHEETS_WEBAPP_URL: import.meta.env.VITE_SHEETS_WEBAPP_URL,
    PRODUCT_URL: "https://itcolor.kr/shop",
    COURSE_URL: "https://itcolor.kr/Experttrainingcourse",
    INTRO_LOGO_PATH: "/brand/itcolor_logo.png",
    LOGO_PATH: "/logo.png",
};

export const LANGS = [
    { code: "ko", label: "한국어" },
    { code: "en", label: "English" },
    { code: "ja", label: "日本語" },
    { code: "zh", label: "中文" },
];

export const AGE_OPTIONS = {
    ko: ["10대 이하(초등학생)", "10대", "20대", "30대", "40대", "50대 이상"],
    en: ["Under teens (elementary)", "Teens", "20s", "30s", "40s", "50s+"],
    ja: ["10代以下(小学生)", "10代", "20代", "30代", "40代", "50代以上"],
    zh: ["10岁以下(小学)", "10多岁", "20多岁", "30多岁", "40多岁", "50岁以上"],
};

export const JOB_OPTIONS = {
    ko: ["학생", "직장인", "공무원", "프리랜서", "자영업", "전업주부", "기타"],
    en: ["Student", "Employee", "Public servant", "Freelancer", "Self-employed", "Homemaker", "Other"],
    ja: ["学生", "会社員", "公務員", "フリーランス", "自営業", "専業主婦(夫)", "その他"],
    zh: ["学生", "上班族", "公务员", "自由职业", "个体经营", "全职主妇", "其他"],
};

export const UI = {
    ko: {
        title: "잇컬러 퍼스널컬러 자가진단",
        sub: "1분 만에 찾는 나의 퍼스널 컬러! 이미 7만 명 이상이 자신의 색을 찾았습니다.\n스타일링 팁부터 시그니처 굿즈까지 만나보세요.",
        lang: "언어",
        gender: "성별 선택",
        female: "여성",
        male: "남성",
        age: "나이 선택",
        job: "직업 선택",
        start: "지금 바로 인생컬러 찾기 시작",
        back: "이전",
        restart: "처음으로",
        saving: "응답 저장 중…",
        saved: "저장 완료 ✅",
        saveFail: "저장 실패(네트워크/URL 확인)",
    },
    en: {
        title: "ITCOLOR Personal Color Assessment",
        sub: "Discover your personal color in just 1 minute.\nFrom styling tips to signature goods that capture your unique color.",
        lang: "Language",
        gender: "Gender",
        female: "Female",
        male: "Male",
        age: "Age group",
        job: "Occupation",
        start: "Find your life color now",
        back: "Back",
        restart: "Home",
        saving: "Saving…",
        saved: "Saved ✅",
        saveFail: "Save failed (check URL/network)",
    },
    ja: {
        title: "ITCOLOR パーソナルカラー自己診断",
        sub: "たった1分で見つかる、あなたのパーソナルカラー。\nスタイリングのヒントから、あなたの色を形にしたシグネチャーグッズまで。",
        lang: "言語",
        gender: "性別",
        female: "女性",
        male: "男性",
        age: "年代",
        job: "職業",
        start: "今すぐ人生カラーを見つける",
        back: "戻る",
        restart: "最初へ",
        saving: "保存中…",
        saved: "保存完了 ✅",
        saveFail: "保存失敗（URL/ネット確認）",
    },
    zh: {
        title: "ITCOLOR 个人色彩诊断",
        sub: "1分钟找到属于你的个人色彩，从造型建议到承载你专属色彩的标志性产品。",
        lang: "语言",
        gender: "性别",
        female: "女性",
        male: "男性",
        age: "年龄段",
        job: "职业",
        start: "立即开始寻找你的人生色彩",
        back: "上一题",
        restart: "首页",
        saving: "保存中…",
        saved: "保存完成 ✅",
        saveFail: "保存失败（检查URL/网络）",
    },
};

/**
 * RESULT는 계산/표기용 "뱃지"만 유지 (필요 최소)
 * 결과 화면의 문구/팔레트/연예인은 RESULT_VIEW_I18N에서 관리
 */
export const RESULT = {
    WSP: { badge: "WARM SPRING" },
    WAU: { badge: "WARM AUTUMN" },
    CS: { badge: "COOL SUMMER" },
    CW: { badge: "COOL WINTER" },
};

export const RESULT_PAGE = {
    ko: {
        yourResultIs: "Find Your Color",
        paletteTitle: "추천 컬러 팔레트",
        celebTitle: "대표 연예인",
        aiTipBtn: "✨ 퍼스널컬러 활용 가이드",
        productBtn: "나만의 컬러 아이템 구매하기",
        courseBtn: "퍼스널컬러 자격증/교육 문의하기",
        shareBtn: "카카오톡으로 공유하기",
        retryBtn: "다시하기",
        aiModalTitle: "✨ 스타일링 어드바이저",
    },
    en: {
        yourResultIs: "Find Your Color",
        paletteTitle: "Recommended Palette",
        celebTitle: "Celeb Reference",
        aiTipBtn: "✨ Personal Color Styling Guide",
        productBtn: "Shop my signature color items",
        courseBtn: "Personal Color Certification Training Inquiry",
        shareBtn: "Share via KakaoTalk",
        retryBtn: "Try Again",
        aiModalTitle: "✨ Your Styling Advisor",
    },
    zh: {
        yourResultIs: "Find Your Color",
        paletteTitle: "推荐色彩盘",
        celebTitle: "参考明星",
        aiTipBtn: "✨ 个人色彩运用指南",
        productBtn: "购买我的专属色彩单品",
        courseBtn: "个人色彩资格课程与培训咨询",
        shareBtn: "通过KakaoTalk分享",
        retryBtn: "再测一次",
        aiModalTitle: "✨ 穿搭顾问",
    },
    ja: {
        yourResultIs: "Find Your Color",
        paletteTitle: "おすすめパレット",
        celebTitle: "参考セレブ",
        aiTipBtn: "✨ パーソナルカラー活用ガイド",
        productBtn: "自分だけのカラーアイテムを購入する",
        courseBtn: "パーソナルカラー資格・講座のお問い合わせ",
        shareBtn: "KakaoTalkで共有",
        retryBtn: "もう一度",
        aiModalTitle: "✨ スタイリングアドバイザー",
    },
};

export const RESULT_VIEW_I18N = {
    WSP: {
        title: { ko: "봄 웜톤", en: "Warm Spring", zh: "暖春型", ja: "ウォームスプリング" },
        card: { ko: "Warm Spring", en: "Warm Spring", zh: "Warm Spring", ja: "Warm Spring" },
        desc: {
            ko: {
                strong: "싱그럽고 생동감 넘치는 매력의 당신!",
                body:
                    "봄의 따뜻한 햇살을 닮은 컬러가 당신의 안색을 가장 밝게 깨워줍니다.\n추천 컬러 팔레트 및 스타일링 팁을 확인하고,\n당신의 생기를 담은 컬러 굿즈를 소장해 보세요."
            },
            en: {
                strong: "You have a fresh and lively charm!",
                body:
                    "Warm, sunlit spring colors brighten your complexion the most.\nCheck out your recommended color palette and styling tips,\nand discover signature color items made just for you."
            },
            zh: {
                strong: "你拥有清新而充满活力的魅力！",
                body:
                    "如春日暖阳般的色彩，最能点亮你的气色。\n查看为你推荐的色彩搭配与穿搭建议，\n发现属于你的专属色彩好物。"
            },
            ja: {
                strong: "あなたは、みずみずしく生き生きとした魅力の持ち主です。",
                body:
                    "春のやさしい日差しのようなカラーが、あなたの表情を明るく引き立てます。\nおすすめのカラーパレットやスタイリングヒントをチェックして、\nあなただけのカラーアイテムを楽しんでください。"
            }
        },
        palette: [
            // 1줄
            "#FCF8E2",
            "#FFEFA0",
            "#F9D7C3",
            "#F4AFA6",
            "#D2EBF3",

            // 2줄
            "#91D1DD",
            "#6EB82C",
            "#009FE8",
            "#EF8B00",
            "#E62210",
        ],
        celebs: {
            ko: "수지, 한지민, NCT정우, 차태현",
            en: "Suzy (Bae Suzy), Han Ji-min, Jungwoo, Cha Tae-hyun",
            zh: "裴秀智、韩志旼、金廷祐、车太贤",
            ja: "スジ、ハン・ジミン、ジョンウ、チャ・テヒョン",
        },
    },
    WAU: {
        title: { ko: "가을 웜톤", en: "Warm Autumn", zh: "暖秋型", ja: "ウォームオータム" },
        card: { ko: "Warm Autumn", en: "Warm Autumn", zh: "Warm Autumn", ja: "Warm Autumn" },
        desc: {
            ko: {
                strong: "고저스한 매력과 깊이 있는 분위기가 공존하는 당신!",
                body:
                    "차분하면서도 풍부한 가을의 컬러가 당신의 분위기를 더욱 깊이 있게 만들어 줍니다.\n추천 컬러 팔레트와 스타일링 팁으로\n당신만의 고급스러움을 완성해 보세요."
            },
            en: {
                strong: "You carry both gorgeous charm and deep elegance!",
                body:
                    "Rich autumn tones enhance your calm yet luxurious presence.\nExplore your color palette and styling tips\nand elevate your sophisticated style."
            },
            zh: {
                strong: "你兼具华丽魅力与深邃气质！",
                body:
                    "沉稳而浓郁的秋季色彩，让你的整体氛围更显高级。\n参考推荐的色彩搭配与风格建议，\n展现属于你的优雅格调。"
            },
            ja: {
                strong: "華やかさと深みのある雰囲気を併せ持つあなた。",
                body:
                    "落ち着いた秋のカラーが、あなたの魅力をより一層引き立てます。\nおすすめの配色とスタイリングで、\n上質な印象を完成させましょう。"
            }
        },
        palette: [
            // 1줄
            "#E1DCBE",
            "#E3AD9F",
            "#D67754",
            "#D67754",
            "#DAB300",

            // 2줄
            "#91B6BB",
            "#51A4C7",
            "#798923",
            "#00608A",
            "#9D3621",
        ],
        celebs: {
            ko: "블랙핑크 제니, 이효리, 공유, 서강준",
            en: "Jennie, Lee Hyori, Gong Yoo, Seo Kang-joon",
            zh: "金珍妮、李孝利、孔刘、徐康俊",
            ja: "ジェニー、イ・ヒョリ、コン・ユ、ソ・ガンジュン",
        },
    },
    CS: {
        title: { ko: "여름 쿨톤", en: "Cool Summer", zh: "冷夏型", ja: "クールサマー" },
        card: { ko: "Cool Summer", en: "Cool Summer", zh: "Cool Summer", ja: "Cool Summer" },
        desc: {
            ko: {
                strong: "부드럽고 우아한 이미지의 당신!",
                body:
                    "은은하고 맑은 여름의 컬러가 당신의 섬세한 분위기를 살려줍니다.\n추천 컬러 팔레트와 스타일링 팁으로\n당신만의 우아함을 완성해 보세요."
            },
            en: {
                strong: "You have a soft and elegant presence!",
                body:
                    "Clear and gentle summer tones enhance your refined mood.\nDiscover your color palette and styling tips\nand embrace your graceful style."
            },
            zh: {
                strong: "你拥有柔和而优雅的形象！",
                body:
                    "清透柔和的夏季色彩，突显你细腻高雅的气质。\n通过推荐的色彩与穿搭建议，\n展现专属于你的优雅风格。"
            },
            ja: {
                strong: "やわらかく上品な印象を持つあなた。",
                body:
                    "澄んだサマーカラーが、あなたの繊細な魅力を引き立てます。\nおすすめの配色とスタイリングで、\nあなたらしい優雅さを表現してください。"
            }
        },
        palette: [
            // 1줄
            "#F9FFC1",
            "#BCDFD4",
            "#63BEAA",
            "#ADC6E8",
            "#87A2D3",

            // 2줄
            "#9088BA",
            "#ED92B9",
            "#B4B4B5",
            "#8A8A8A",
            "#B4609F",
        ],
        celebs: {
            ko: "김연아, 전지현, 송중기, 조인성",
            en: "Yuna Kim, Jun Ji-hyun, Song Joong-ki, Jo In-sung",
            zh: "金妍儿、全智贤、宋仲基、赵寅成",
            ja: "キム・ヨナ、チョン・ジヒョン、ソン・ジュンギ、チョ・インソン",
        },
    },
    CW: {
        title: { ko: "겨울 쿨톤", en: "Cool Winter", zh: "冷冬型", ja: "クールウィンター" },
        card: { ko: "Cool Winter", en: "Cool Winter", zh: "Cool Winter", ja: "Cool Winter" },
        desc: {
            ko: {
                strong: "세련되고 도시적인 카리스마를 지닌 당신!",
                body: "뚜렷한 대비감이 당신의 쿨하고 시크한 존재감을 극대화해 줍니다.\n추천 컬러 팔레트 및 스타일링 팁을 확인하고,\n당신의 시크함을 담은 컬러 굿즈를 소장해 보세요."
            },
            en: {
                strong: "You radiate refined, urban charisma.",
                body: "Bold contrast enhances your cool, chic presence to its fullest.\nDiscover your recommended color palette and styling tips,\nand own a signature color item that captures your chic attitude."
            },
            zh: {
                strong: "拥有精致都市魅力与强大气场的你。",
                body: "鲜明的对比感，将你的冷感与摩登气质发挥到极致。\n查看推荐的色彩搭配与造型建议，\n将承载你酷感魅力的色彩周边收藏起来吧。"
            },
            ja: {
                strong: "洗練された都会的なカリスマを持つあなた。",
                body: "はっきりとしたコントラストが、あなたのクールでシックな存在感を最大限に引き立てます。\nおすすめのカラーパレットとスタイリングヒントをチェックして、\nあなたのシックさを映したカラーグッズをぜひ手に入れてください。"
            }
        },
        palette: [
            // 1줄
            "#070304",
            "#E5FD03",
            "#29825C",
            "#005E41",
            "#004096",

            // 2줄
            "#002454",
            "#E2007E",
            "#D11257",
            "#7D1F69",
            "#542C76",
        ],
        celebs: {
            ko: "블랙핑크 지수, 김혜수, 이수혁, 차승원",
            en: "Jisoo, Kim Hye-soo, Lee Soo-hyuk, Cha Seung-won",
            zh: "金智秀、金惠秀、李洙赫、车胜元",
            ja: "ジス、キム・ヘス、イ・スヒョク、チャ・スンウォン",
        },
    },
};
