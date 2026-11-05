const app = document.querySelector("#app");
const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
let soundEnabled = true;
try { soundEnabled = localStorage.getItem("chao-sound") !== "off"; } catch {}
let answerAudio;
function playAnswerSound() {
  if (!soundEnabled) return;
  try {
    const AudioEngine = window.AudioContext || window.webkitAudioContext;
    if (!AudioEngine) return;
    answerAudio ||= new AudioEngine();
    const context = answerAudio;
    const play = () => {
      if (!soundEnabled || context.state !== "running") return;
      const start = context.currentTime;
      [523.25, 1046.5].forEach((frequency, index) => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(frequency, start);
        oscillator.frequency.exponentialRampToValueAtTime(frequency * .97, start + .16);
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(index ? .009 : .04, start + .008);
        gain.gain.exponentialRampToValueAtTime(.0001, start + .22);
        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.start(start);
        oscillator.stop(start + .24);
        oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
      });
    };
    if (context.state === "suspended") context.resume().then(play).catch(() => {});
    else play();
  } catch {}
}

const categories = {
  luck: {
    label: "幸运符",
    code: "LUCK",
    subtitle: "把好运调到今天",
    scoreLabel: "幸运指数",
    image: "./assets/library/wallpapers/luck/luck-jinshexianrui.png",
    cyber: "./assets/library/wallpapers/luck/luck-cyber-jinshexianrui.jpg",
    loadingGif: "./assets/animations/loading/loading-02.gif",
    burnVideo: "./assets/animations/burn/mp4/luck-jinshexianrui.mp4",
    scale: "2—10 分",
    shareWallpapers: [
      { src: "./assets/library/wallpapers/luck/luck-jinshexianrui.png", label: "彩色符文版" },
      { src: "./assets/library/wallpapers/luck/luck-cyber-jinshexianrui.jpg", label: "赛博壁纸版" },
    ],
    glyph: "金蛇献瑞",
    resultText: "普通玩家｜需要更多主动行动来吸引好运，多关注环境中的细节和机会，幸运会更常降临。",
    wallpapers: [
      ["luck-jinshexianrui.png", "金蛇献瑞"], ["luck-jinshebaoxi.png", "金蛇报喜"], ["luck-hongyundangtou.png", "鸿运当头"],
      ["luck-fengxionghuaji.png", "逢凶化吉"], ["luck-bubugaosheng.png", "步步高升"], ["luck-shilaiyunzhuan.png", "时来运转"],
      ["luck-cyber-jinshexianrui.jpg", "赛博·金蛇献瑞"], ["luck-cyber-jinshebaoxi.jpg", "赛博·金蛇报喜"], ["luck-cyber-hongyundangtou.jpg", "赛博·鸿运当头"],
      ["luck-cyber-fengxionghuaji.jpg", "赛博·逢凶化吉"], ["luck-cyber-bubugaosheng.jpg", "赛博·步步高升"], ["luck-cyber-shilaiyunzhuan.jpg", "赛博·时来运转"],
    ].map(([file, label]) => ({ src: `./assets/library/wallpapers/luck/${file}`, label })),
  },
  career: {
    label: "事业符",
    code: "WORK",
    subtitle: "让锋芒被看见",
    scoreLabel: "事业指数",
    image: "./assets/library/wallpapers/career/career-ruhutianyi.png",
    cyber: "./assets/career-cyber.jpg",
    loadingGif: "./assets/animations/loading/loading-04.gif",
    burnVideo: "./assets/animations/burn/mp4/career-ruhutianyi.mp4",
    scale: "1—5 分",
    shareWallpapers: [
      { src: "./assets/library/wallpapers/career/career-ruhutianyi.png", label: "彩色符文版" },
      { src: "./assets/career-cyber.jpg", label: "赛博壁纸版" },
    ],
    glyph: "如虎添翼",
    resultText: "你的推进力正在上升。把目标拆成可以在今天完成的一步，贵人和机会会更容易靠近。",
    wallpapers: [
      ["career-ruhutianyi.png", "如虎添翼"], ["career-wanrenzhishang.png", "万人之上"], ["career-lingdaikexing.png", "领导克星"],
      ["career-shuineizhifu.png", "睡能致富"], ["career-banzhuhuchi.png", "扮猪吃虎"], ["career-daixinmoyu.png", "带薪摸鱼"],
      ["career-yellow-ruhutianyi.jpg", "黄符·如虎添翼"], ["career-yellow-wanrenzhishang.jpg", "黄符·万人之上"], ["career-yellow-lingdaikexing.jpg", "黄符·领导克星"],
      ["career-yellow-shuineizhifu.jpg", "黄符·睡能致富"], ["career-yellow-banzhuhuchi.png", "黄符·扮猪吃虎"], ["career-yellow-daixinmoyu.jpg", "黄符·带薪摸鱼"],
    ].map(([file, label]) => ({ src: `./assets/library/wallpapers/career/${file}`, label })),
  },
  study: {
    label: "学业符",
    code: "STUDY",
    subtitle: "把专注力点亮",
    scoreLabel: "学业指数",
    image: "./assets/library/wallpapers/study/study-batiyongcun.png",
    cyber: "./assets/study-poster.png",
    loadingGif: "./assets/animations/loading/loading-03.gif",
    burnVideo: "./assets/animations/burn/mp4/study-batiyongcun.mp4",
    scale: "1—5 分",
    shareWallpapers: [
      { src: "./assets/library/wallpapers/study/study-batiyongcun.png", label: "彩色符文版" },
      { src: "./assets/study-poster.png", label: "赛博壁纸版" },
    ],
    glyph: "霸体永存",
    resultText: "你适合用短冲刺换取持续反馈。先完成，再优化，今天会比你想象中更有进展。",
    wallpapers: [
      ["study-babazaici.png", "霸霸在此"], ["study-batiyongcun.png", "霸体永存"], ["study-batishangshen.png", "霸体上身"],
      ["study-tangpingchengba.png", "躺平称霸"], ["study-miebashangwei.png", "灭霸上位"], ["study-dajibafu.png", "大吉霸夫"],
      ["study-yellow-babazaici.png", "黄符·霸霸在此"], ["study-yellow-batiyongcun.png", "黄符·霸体永存"], ["study-yellow-batishangshen.png", "黄符·霸体上身"],
      ["study-yellow-tangpingchengba.png", "黄符·躺平称霸"], ["study-yellow-miebashangwei.png", "黄符·灭霸上位"], ["study-yellow-dajibafu.png", "黄符·大吉霸夫"],
    ].map(([file, label]) => ({ src: `./assets/library/wallpapers/study/${file}`, label })),
  },
};

const questionSets = {
  luck: [
    "我喜欢尝试新的活动或兴趣爱好，即使一开始觉得陌生。",
    "我经常主动探索自己不了解的领域。",
    "面对困难时，我相信事情最终会朝好的方向发展。",
    "我认为自己能够影响和改变命运。",
    "我喜欢结识新朋友，并主动维系人际关系。",
    "我觉得我的人脉资源丰富，对我的生活帮助很大。",
    "在不确定的情况下，我常凭感觉做出决定。",
    "我觉得自己能迅速判断某种环境中的潜在机会或风险。",
    "即使遇到困难，我也能很快恢复并寻找新的方向。",
    "我觉得挫折是一种学习的机会，而非失败。",
    "我经常注意到别人忽略的小细节。",
    "我会同时关注身边多种可能性，而不是只盯着一个目标。",
    "我愿意尝试未知的机会，即使有一定的风险。",
    "我认为高风险常常伴随高回报。",
    "我经常感到自己是幸运的。",
    "我觉得自己过去经历的一切都很值得珍惜。",
  ],
  career: [
    "我喜欢修理家里的各种小电器或工具。",
    "我觉得动手做事情比动脑子更有趣。",
    "我向往在户外工作，而不是整天待在办公室。",
    "看到一个复杂的机械装置，我会忍不住想研究它是如何运作的。",
    "我喜欢参与需要体力和技巧的活动，比如攀岩或木工。",
    "我更喜欢有具体成果的工作，而不是只动嘴皮子的事情。",
    "操作设备或驾驶机器让我感到兴奋。",
    "我喜欢亲自动手而不是通过屏幕或书本学习。",
    "我对农耕、种植或与自然相关的工作感兴趣。",
    "我觉得开车旅行比坐在家里更有吸引力。",
    "我喜欢解决数学或科学问题。",
    "我更喜欢用逻辑和数据来分析问题。",
    "我常常对自然现象的原因感到好奇，比如为什么下雨或打雷。",
    "我享受阅读关于新科技或新发现的文章。",
    "当我看到一个现象时，我会想找出背后的原理。",
    "我喜欢从事实验或调查研究的工作。",
  ],
  study: [
    "我的学习目标明确，就像打游戏开图，不开荒不罢休。",
    "我觉得学习就是为未来充电，能量满满走向人生巅峰。",
    "作业练习搞定后，我的快乐值直接拉满，成就感+100。",
    "就算学习像爬山，我也会咬牙爬到山顶，然后自拍打卡。",
    "不管我的学习成绩好与坏，我都从不怀疑自己的学习能力。",
    "如果学习是开盲盒，我愿意天天开，因为总能学到新东西。",
    "没人盯着，我也会主动学习，毕竟我对得起自己的努力。",
    "我觉得学习是“氪金”未来，越努力，技能点越高。",
    "每次学会新知识，我都想给自己点个赞，#学霸的日常#。",
    "新的学习方法？必须试试！升级打怪不能停！",
    "学习时，我会做“神仙笔记”，看了之后自己都感动。",
    "学习内容太杂？划重点+提纲，学得清清楚楚！",
    "我用各种“神操作”记忆知识点，脑子里自带外挂。",
    "“重要知识先安排！”复习计划表我都贴墙上了。",
    "把学习任务分成小块完成，效率简直“嗖嗖嗖”。",
    "我会利用 AI 工具（比如 ChatGPT 或翻译软件）来辅助完成学习任务。",
  ],
};

questionSets.career = completeQuestionBank.career.map((item) => item.text);
questionSets.study = completeQuestionBank.study.map((item) => item.text);
function getQuestions() { return questionSets[state?.category || "luck"]; }
function dimensionResults() {
  const labels = state.category === "career"
    ? ["现实型 R", "研究型 I", "艺术型 A", "社会型 S", "企业型 E", "常规型 C"]
    : ["学习动力", "学习策略", "认知能力", "元认知能力", "情绪与压力管理", "社交学习能力"];
  return labels.map((label, index) => ({ label, score: state.selections.slice(index * 10, index * 10 + 10).reduce((sum, value) => sum + (value === null ? 0 : value + 1), 0) }));
}

const options = ["完全不符合", "较不符合", "不能确定", "较符合", "完全符合"];

const questionGuides = [
  "先凭第一反应，不用把自己分析得太久。",
  "想象一个最近真实发生过的场景。",
  "选择最像你平时做法的那一项。",
  "注意你最想保护、争取或推进的东西。",
  "把答案留给此刻的直觉。",
];

const methodologyContent = {
  eyebrow: "METHOD / CONTENT SLOT",
  title: "正在校准你的今日符阵",
  intro: "本轮会读取题库中的维度与情境题目，再把你的第一直觉生成一张今日符文。正式说明文案到位后，可直接替换这块内容。",
  note: "基于项目题库的体验原型说明 · 不构成心理诊断",
  steps: ["维度读取", "16 题匹配", "符文结果生成"],
};

const state = {
  screen: "home",
  category: "luck",
  questionIndex: 0,
  selections: Array(16).fill(null),
  score: 84,
  wallpaper: categories.luck.image,
  burning: false,
  burnStage: "ready",
  burnToken: 0,
  loadingToken: 0,
};

const previewScreen = new URLSearchParams(window.location.search).get("preview");
const previewCategory = new URLSearchParams(window.location.search).get("category");
if (Object.hasOwn(categories, previewCategory)) {
  state.category = previewCategory;
  state.selections = Array(getQuestions().length).fill(null);
  state.wallpaper = categories[previewCategory].image;
}
if (["home", "loading", "quiz", "result", "glyph", "burn", "share", "secrets"].includes(previewScreen)) state.screen = previewScreen;
const previewBurnStage = new URLSearchParams(window.location.search).get("stage");
if (previewScreen === "burn" && ["prayer", "ignite", "reveal"].includes(previewBurnStage)) {
  state.burning = true;
  state.burnStage = previewBurnStage;
}

function meta() { return categories[state.category]; }
const progressKey = "chao-quiz-progress-v1";
function saveProgress() {
  try { localStorage.setItem(progressKey, JSON.stringify({ category: state.category, questionIndex: state.questionIndex, selections: state.selections })); } catch {}
}
function resumeProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(progressKey));
    if (!saved || !Object.hasOwn(questionSets, saved.category) || !Array.isArray(saved.selections) || saved.selections.length !== questionSets[saved.category].length || !saved.selections.every((v) => v === null || (Number.isInteger(v) && v >= 0 && v < 5))) return false;
    state.category = saved.category;
    state.selections = saved.selections;
    state.questionIndex = Math.max(0, Math.min(Number.isInteger(saved.questionIndex) ? saved.questionIndex : 0, saved.selections.length - 1));
    state.wallpaper = meta().image;
    return true;
  } catch { return false; }
}

function topbar() {
  const questionCount = getQuestions().length;
  return `
    <header class="topbar">
      <div class="brand-lockup">
        <span class="brand-seal">✦</span>
        <span><b class="brand-mark">朝·广州</b><small>CHAO / RITUAL LAB</small></span>
      </div>
      <span class="topbar-counter"><b>01</b><i></i><span>${String(questionCount).padStart(2, "0")}</span></span>
    </header>
  `;
}

function nav() {
  const current = state.screen === "home" ? "home" : ["loading", "quiz"].includes(state.screen) ? "quiz" : state.screen === "share" ? "share" : state.screen === "glyph" ? "glyph" : "";
  return `
    <nav class="bottom-nav" aria-label="主导航">
      <button class="nav-item ${current === "home" ? "is-active" : ""}" data-action="nav" data-target="home"><span>⌂</span><span>首页</span></button>
      <button class="nav-item ${current === "quiz" ? "is-active" : ""}" data-action="nav" data-target="quiz"><span>◈</span><span>测一测</span></button>
      <button class="nav-item ${current === "glyph" ? "is-active" : ""}" data-action="nav" data-target="glyph"><span>✦</span><span>我的符</span></button>
      <button class="nav-item ${current === "share" ? "is-active" : ""}" data-action="nav" data-target="share"><span>↗</span><span>分享</span></button>
    </nav>
  `;
}

function homeScreen() {
  return `
    <section class="screen home-screen">
      <div class="home-hero">
        <div class="hero-topline"><span>RITUAL / 001</span><span>SELF / 60 SEC</span></div>
        <div class="hero-sigil" aria-hidden="true">福</div>
        <div class="hero-orbit hero-orbit-one" aria-hidden="true"></div>
        <div class="hero-orbit hero-orbit-two" aria-hidden="true"></div>
        <div class="hero-copy">
          <div class="eyebrow">LUCK LAB / 2026</div>
          <h1>万事有朝。<br /><em>好运有你。</em></h1>
          <p>${getQuestions().length} 个问题，了解你的${state.category === "career" ? "职业兴趣" : state.category === "study" ? "学习状态" : "今日状态"}。<br />最后把答案炼成一张可以带走的符。</p>
          <div class="hero-proof"><span></span><small>FIRST INTUITION / ONLY</small></div>
        </div>
        <div class="hero-actions">
          <button class="button button-primary" data-action="start">开始测一测 <span>→</span></button>
          <button class="button button-secondary" data-action="resume">继续上次答题</button>
          <button class="button button-secondary button-icon" data-action="nav" data-target="share" aria-label="查看分享">↗</button>
        </div>
      </div>

      <div class="section-head">
        <div><div class="eyebrow">CHOOSE YOUR BUFF</div><h2>选择想增强的方向</h2></div>
        <span class="small muted section-note">OPTIONAL</span>
      </div>
      <div class="category-grid">
        ${Object.entries(categories).map(([key, item], categoryIndex) => `
          <button class="category-card ${state.category === key ? "is-active" : ""}" data-action="category" data-category="${key}">
            <img src="${item.image}" alt="" />
            <span class="category-index">0${categoryIndex + 1} / ${item.code}</span>
            <strong>${item.label}</strong>
            <span>${item.subtitle}</span>
            <i class="category-signal" aria-hidden="true"></i>
          </button>
        `).join("")}
      </div>

      <div class="section-head">
        <div><div class="eyebrow">TODAY'S RITUAL</div><h2>今日小仪式</h2></div>
      </div>
      <div class="neon-panel ritual-panel">
        <div class="ritual-icon" aria-hidden="true">◌</div>
        <div class="ritual-body"><p>闭眼 3 秒，想一个今天最想发生的画面。</p><small>不要反复修改你的第一直觉。</small></div>
        <div class="ritual-steps"><span class="is-current"></span><span></span><span></span></div>
      </div>
    </section>
  `;
}

function loadingScreen() {
  return `
    <section class="screen loading-screen" aria-live="polite">
      <img class="loading-media" src="${motionPreference.matches ? meta().cyber : meta().loadingGif}" alt="" aria-hidden="true" />
      <div class="loading-backdrop" aria-hidden="true"><span></span><span></span><span></span></div>
      <div class="loading-panel neon-panel">
        <div class="eyebrow">${methodologyContent.eyebrow}</div>
        <div class="loading-oracle" aria-hidden="true"><i></i><b>符</b></div>
        <div class="loading-kicker"><span></span>RITUAL ENGINE / INITIALIZING</div>
        <h1>${methodologyContent.title}</h1>
        <p>${methodologyContent.intro}</p>
        <div class="loading-steps">
          ${methodologyContent.steps.map((step, index) => `<span><i>0${index + 1}</i>${index === 1 ? `${getQuestions().length} 题匹配` : step}</span>`).join("")}
        </div>
        <div class="loading-progress"><span></span></div>
        <div class="loading-label">准备就绪</div>
        <small>${methodologyContent.note}</small>
        <button class="button button-primary" data-action="begin-quiz" style="margin-top:20px">了解了，开始答题 →</button>
      </div>
    </section>
  `;
}

function quizScreen() {
  const questions = getQuestions();
  const index = state.questionIndex;
  const answer = state.selections[index];
  const answeredCount = state.selections.filter((value) => value !== null).length;
  const remaining = questions.length - answeredCount;
  const stage = index < 2 ? "SENSE" : index < 4 ? "CHOOSE" : "ECHO";
  return `
    <section class="screen quiz-screen">
      <div class="section-head" style="margin-top: 0">
        <div><div class="eyebrow">${meta().label} / ${stage}</div><h2>${meta().scoreLabel}</h2></div>
        <span class="progress"><b>${index + 1}</b><em>/ ${questions.length}</em></span>
      </div>
      <div class="neon-panel quiz-panel">
        <div class="quiz-top"><span class="small muted">回答第一直觉，不用想太久</span><span class="quiz-energy">${answeredCount} / ${questions.length} 已入阵</span></div>
        <button class="sound-toggle" data-action="toggle-sound" aria-pressed="${soundEnabled}" aria-label="答题音效${soundEnabled ? "已开启，点击关闭" : "已关闭，点击开启"}">音效 · ${soundEnabled ? "开" : "关"}</button>
        <div class="progress-line"><span style="width:${((index + 1) / questions.length) * 100}%"></span></div>
        <div class="quiz-momentum" aria-label="答题进度">
          ${questions.map((_, questionIndex) => `<i class="${questionIndex < answeredCount ? "is-done" : ""} ${questionIndex === index ? "is-current" : ""}"></i>`).join("")}
        </div>
        <div class="quiz-prompt"><span>${state.category === "luck" ? "Q" : dimensionResults()[Math.floor(index / 10)].label} / ${index + 1}</span><span>${remaining ? `还剩 ${remaining} 题` : "题目已完成"}</span></div>
        <h2>${questions[index]}</h2>
        <p class="quiz-guide">${questionGuides[index % questionGuides.length]} · 计分范围 ${meta().scale}</p>
        <div class="choices" role="radiogroup" aria-label="选择答案">
          ${options.map((option, optionIndex) => `
            <button class="choice ${answer === optionIndex ? "is-selected" : ""}" data-action="answer" data-answer="${optionIndex}" role="radio" aria-checked="${answer === optionIndex}">${option}</button>
          `).join("")}
        </div>
        <div class="quiz-actions">
          <button class="button button-secondary" data-action="prev" ${index === 0 ? "disabled" : ""}>上一题</button>
          <button class="button button-primary" data-action="next">${index === questions.length - 1 ? "查看结果" : "下一题"}</button>
        </div>
        <div class="quiz-footnote">${answer === null ? "选定后，符阵会记录你的第一直觉。" : "已记录 · 你可以继续，也可以返回修改。"}</div>
      </div>
      <p class="small muted" style="margin:16px 4px">每一次选择都会让专属符文更接近你。</p>
    </section>
  `;
}

function resultScreen() {
  const luckReading = state.score >= 129
    ? "天选之人｜你拥有丰富的幸运特质，抓住机会对你来说是轻而易举的。"
    : state.score >= 97
      ? "潜在锦鲤｜你具备一定的幸运特质，可以通过加强开放性或乐观性进一步提升。"
      : state.score >= 65
        ? "普通玩家｜多关注环境中的细节和机会，用主动行动创造更多可能。"
        : "隐形机会达人｜培养积极心态和行动习惯，尝试发现身边被忽略的机会。";
  return `
    <section class="screen result-screen">
      <div class="result-topline"><span>READING / 004</span><span>SYNCED</span></div>
      <div class="result-orbit"></div>
      <div class="eyebrow">${meta().label} / RESULT</div>
      <div class="result-date">2026 · 11 · 04</div>
      <h1>你的${meta().scoreLabel}</h1>
      <div class="score-wrap">
        <div class="score-ring"><div class="score">${state.score}</div></div>
        <span class="score-tick score-tick-top">SIGNAL</span><span class="score-tick score-tick-bottom">${meta().code}</span>
      </div>
      <div class="score-label">TODAY'S BUFF LEVEL / ${meta().code}</div>
      <div class="result-pills"><span>${getQuestions().length} 题已完成</span><span>满分 ${state.category === "luck" ? 160 : 300}</span></div>
      <p class="result-copy">${state.category === "luck" ? luckReading : state.category === "career" ? "各维度反映你的职业兴趣倾向，不代表能力高低。相同得分表示并列倾向。" : "各维度反映本次自评的学习状态，可以从得分较低的维度选择一个行动开始调整。"}</p>
      ${state.category === "luck" ? "" : `<div class="dimension-results">${dimensionResults().map((item) => `<div><span>${item.label}</span><strong>${item.score} / 50</strong><progress max="50" value="${item.score}" aria-label="${item.label}"></progress></div>`).join("")}</div>`}
      <button class="button button-primary" data-action="to-glyph">超吉守运 →</button>
      <p class="small muted" style="margin-top:14px">下一步：把结果化成你的专属符文</p>
    </section>
  `;
}

function glyphScreen() {
  return `
    <section class="screen glyph-screen">
      <div class="glyph-heading">
        <div><div class="eyebrow">YOUR AMULET / 01</div><h2>${meta().glyph}</h2></div>
        <span>${meta().label} · 2026</span>
      </div>
      <div class="poster-frame">
        <img src="${meta().image}" alt="${meta().label}结果符文" />
        <span class="poster-caption">GOOD LUCK / ${state.score}</span>
      </div>
      <div class="glyph-actions">
        <button class="button button-primary" data-action="burn">化符</button>
        <button class="button button-secondary" data-action="nav" data-target="share">先看看分享页</button>
      </div>
    </section>
  `;
}

function burnScreen() {
  const playing = state.burning && ["ignite", "reveal"].includes(state.burnStage);
  return `<section class="screen ritual-cinema ${playing ? "is-playing" : ""}">
    ${playing ? `<video id="ritual-video" ${motionPreference.matches ? "controls" : "autoplay"} muted playsinline preload="metadata" poster="${meta().image}" aria-label="${meta().glyph}化宝动画"><source src="${meta().burnVideo}" type="video/mp4"></video>
      <p class="cinema-status" role="status">${motionPreference.matches ? "已减少动态效果，轻触播放或跳过动画" : "正在准备火光…"}</p>
      <button class="burn-skip" data-action="skip-burn">跳过动画</button>` : `<div class="prayer-intro"><span class="eyebrow">${meta().label} · ${meta().glyph}</span><img src="${meta().cyber}" alt="${meta().glyph}符文"><h2>${state.burning ? "静心，诚心祈愿" : "把心愿交给符火"}</h2><p>${state.burning ? "在心里默念，你最想发生的一件事。" : "留三秒给自己，让心愿慢慢清晰。"}</p>${state.burning ? `<span class="prayer-breath" aria-label="静心祈愿中"></span>` : `<button class="button button-primary" data-action="ignite">诚心祈愿 · 化宝</button>`}</div>`}
  </section>`;
}

let holdTimer;
let holdButton;
function cancelPrayerHold() {
  window.clearTimeout(holdTimer);
  if (holdButton) holdButton.classList.remove("is-holding");
  holdButton = null;
}
document.addEventListener("pointerdown", (event) => {
  const button = event.target.closest('[data-action="hold-prayer"]');
  if (!button || event.button !== 0) return;
  cancelPrayerHold();
  holdButton = button;
  button.classList.add("is-holding");
  button.setPointerCapture?.(event.pointerId);
  holdTimer = window.setTimeout(() => {
    cancelPrayerHold();
    if (state.screen !== "burn" || state.burning) return;
    state.burning = true;
    state.burnStage = "ignite";
    render();
  }, 2000);
});
document.addEventListener("pointerup", cancelPrayerHold);
document.addEventListener("pointercancel", cancelPrayerHold);
document.addEventListener("visibilitychange", () => { if (document.hidden) cancelPrayerHold(); });


function shareScreen() {
  const shareWallpapers = meta().shareWallpapers;
  const libraryWallpapers = meta().wallpapers.filter((item) => !shareWallpapers.some((shareItem) => shareItem.src === item.src));
  const wallpaperCards = (wallpapers) => wallpapers.map((item) => `
    <figure class="wallpaper-card ${state.wallpaper === item.src ? "is-selected" : ""}" data-action="wallpaper" data-wallpaper="${item.src}">
      <img src="${item.src}" alt="${item.label}" />
      <figcaption>${item.label}</figcaption>
    </figure>
  `).join("");
  return `
    <section class="screen share-screen">
      <div class="share-title"><div><div class="eyebrow">SHARE YOUR LUCK</div><h2>分享得福</h2></div><span>READY</span></div>
      <div class="neon-panel share-hero">
        <p>把今天的好运分享给朋友。</p>
        <button class="button button-warning" data-action="share">分享得福 ↗</button>
      </div>
      <div class="section-head" style="margin-top:24px"><div><div class="eyebrow">TAKE BOTH WITH YOU</div><h2>两张壁纸一起带走</h2></div><span class="small muted section-note">PAIR / READY</span></div>
      <div class="wallpaper-grid">
        ${wallpaperCards(shareWallpapers)}
      </div>
      <div class="share-actions">
        <button class="button button-primary" data-action="save-all">保存两张壁纸</button>
        <button class="button button-warning" data-action="secrets">幸运秘籍</button>
        <button class="button button-pink" data-action="reset">再测一次</button>
      </div>
      <details class="wallpaper-library">
        <summary>查看更多符文壁纸 · ${libraryWallpapers.length}</summary>
        <div class="wallpaper-grid">${wallpaperCards(libraryWallpapers)}</div>
      </details>
    </section>
  `;
}

function secretsScreen() {
  const guides = {
    luck: [
      ["给机会留一道门", "今天尝试一件平时不会做的小事：走一条新路线，或主动开启一次交流。"],
      ["把直觉变成观察", "记下一个你注意到的小细节。遇到重要选择时，再补充事实和信息。"],
      ["让好事留下来", "睡前写下一件值得感谢的小事，以及明天愿意主动做的一步。"],
    ],
    career: [
      ["找到有能量的任务", "回想最近一周，哪件任务让你愿意多投入十分钟？记下具体原因。"],
      ["做一次小实验", "挑一个感兴趣的工作方向，安排一次访谈、体验或小作品，用行动收集反馈。"],
      ["让进展被看见", "把今天完成的一件事写成：做了什么、解决了什么、下一步是什么。"],
    ],
    study: [
      ["把目标缩小到今天", "选一个知识点，给自己安排一段能专心完成的学习时间。"],
      ["合上资料试着讲", "用自己的话解释刚学的内容，讲不清楚的部分就是下一次复习重点。"],
      ["复盘一次，再继续", "记录今天有效的方法和一个卡点，明天只调整一个学习动作。"],
    ],
  };
  return `<section class="screen secrets-screen">
    <div class="eyebrow">${meta().label} / DAILY PRACTICE</div>
    <h1>把好运，落在行动里</h1>
    <p class="secrets-intro">带着「${meta().glyph}」，选一件今天就能做到的小事。</p>
    ${guides[state.category].map(([title, body], index) => `<article class="secret-step"><span>0${index + 1}</span><div><h2>${title}</h2><p>${body}</p></div></article>`).join("")}
    <p class="secrets-note">这份行动清单随你选择的方向提供，可按自己的情况调整。</p>
    <button class="button button-primary" data-action="nav" data-target="share">返回我的壁纸</button>
  </section>`;
}

function wallpaperArchive(files) {
  const chunks = [], directory = [];
  let offset = 0;
  const header = (size) => { const bytes = new Uint8Array(size); return { bytes, view: new DataView(bytes.buffer) }; };
  for (const file of files) {
    const name = new TextEncoder().encode(file.name);
    let crc = 0xffffffff;
    for (const byte of file.data) {
      crc ^= byte;
      for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
    }
    crc = (crc ^ 0xffffffff) >>> 0;
    const local = header(30);
    local.view.setUint32(0, 0x04034b50, true);
    local.view.setUint16(4, 20, true);
    local.view.setUint16(6, 0x800, true);
    local.view.setUint32(14, crc, true);
    local.view.setUint32(18, file.data.length, true);
    local.view.setUint32(22, file.data.length, true);
    local.view.setUint16(26, name.length, true);
    const central = header(46);
    central.view.setUint32(0, 0x02014b50, true);
    central.view.setUint16(4, 20, true);
    central.view.setUint16(6, 20, true);
    central.view.setUint16(8, 0x800, true);
    central.view.setUint32(16, crc, true);
    central.view.setUint32(20, file.data.length, true);
    central.view.setUint32(24, file.data.length, true);
    central.view.setUint16(28, name.length, true);
    central.view.setUint32(42, offset, true);
    chunks.push(local.bytes, name, file.data);
    directory.push(central.bytes, name);
    offset += 30 + name.length + file.data.length;
  }
  const directorySize = directory.reduce((sum, part) => sum + part.length, 0);
  const end = header(22);
  end.view.setUint32(0, 0x06054b50, true);
  end.view.setUint16(8, files.length, true);
  end.view.setUint16(10, files.length, true);
  end.view.setUint32(12, directorySize, true);
  end.view.setUint32(16, offset, true);
  return new Blob([...chunks, ...directory, end.bytes], { type: "application/zip" });
}

function toast(message) {
  const node = document.createElement("div");
  node.className = "toast is-visible";
  node.textContent = message;
  document.body.appendChild(node);
  window.setTimeout(() => node.remove(), 1900);
}

function render() {
  cancelPrayerHold();
  if (document.head && ["glyph", "burn"].includes(state.screen) && !document.querySelector('link[data-ritual-preload]')) {
    const preload = document.createElement("link");
    preload.rel = "preload";
    preload.as = "video";
    preload.href = meta().burnVideo;
    preload.dataset.ritualPreload = "true";
    document.head?.appendChild(preload);
  }
  const content = state.screen === "home" ? homeScreen() : state.screen === "loading" ? loadingScreen() : state.screen === "quiz" ? quizScreen() : state.screen === "result" ? resultScreen() : state.screen === "glyph" ? glyphScreen() : state.screen === "burn" ? burnScreen() : state.screen === "secrets" ? secretsScreen() : shareScreen();
  const immersive = ["loading", "quiz", "burn", "share", "secrets"].includes(state.screen);
  app.innerHTML = immersive ? content : `${topbar()}${content}${nav()}`;
  if (state.screen === "burn" && !state.burning && !motionPreference.matches) {
    const intro = app.querySelector(".prayer-intro");
    if (intro) {
      const hold = document.createElement("button");
      hold.className = "button button-primary prayer-hold";
      hold.dataset.action = "hold-prayer";
      hold.textContent = "按住两秒，心愿入符";
      intro.insertBefore(hold, intro.lastElementChild);
      intro.lastElementChild.classList.replace("button-primary", "button-secondary");
      intro.lastElementChild.textContent = "或点击开始 · 静心三秒";
    }
  }
  const video = document.querySelector("#ritual-video");
  if (video) {
    const status = app.querySelector(".cinema-status");
    video.addEventListener("playing", () => { status.hidden = true; });
    video.addEventListener("waiting", () => { status.hidden = false; status.textContent = "火光正在载入…"; });
    video.addEventListener("stalled", () => { status.hidden = false; status.textContent = "网络较慢，正在等待动画；也可以跳过"; });
    video.addEventListener("ended", () => { state.burning = false; state.burnStage = "ready"; go("share"); }, { once: true });
    video.addEventListener("error", () => { status.hidden = false; status.textContent = "动画暂时无法播放，可以跳过查看壁纸。"; }, true);
    if (!motionPreference.matches) video.play().catch(() => { video.controls = true; status.textContent = "轻触播放，完成化宝仪式"; });
  }
}

function go(target) {
  state.screen = target;
  if (target === "home") state.questionIndex = 0;
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.addEventListener("click", async (event) => {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  const action = target.dataset.action;
  if (action === "toggle-sound") {
    soundEnabled = !soundEnabled;
    try { localStorage.setItem("chao-sound", soundEnabled ? "on" : "off"); } catch {}
    target.textContent = `音效 · ${soundEnabled ? "开" : "关"}`;
    target.setAttribute("aria-pressed", String(soundEnabled));
    target.setAttribute("aria-label", `答题音效${soundEnabled ? "已开启，点击关闭" : "已关闭，点击开启"}`);
    if (soundEnabled) playAnswerSound();
    return;
  }

  if (action === "category") {
    state.category = target.dataset.category;
    state.wallpaper = meta().image;
    state.questionIndex = 0;
    state.selections = Array(getQuestions().length).fill(null);
    render();
    toast(`已切换：${meta().label}`);
  }
  if (action === "start") {
    state.questionIndex = 0;
    state.selections = Array(getQuestions().length).fill(null);
    saveProgress();
    go("loading");
  }
  if (action === "resume") {
    if (resumeProgress()) go("quiz");
    else toast("还没有可继续的答题记录");
  }
  if (action === "begin-quiz") go("quiz");
  if (action === "nav") {
    const next = target.dataset.target;
    if (next === "glyph" && state.screen === "home") { toast("先完成一次测试，符文会在结果页生成"); return; }
    if (next === "share" && state.screen === "home") { toast("先完成一次测试，再把好运分享出去"); return; }
    go(next);
  }
  if (action === "answer") {
    if (state.screen !== "quiz") return;
    if (state.selections[state.questionIndex] !== Number(target.dataset.answer)) playAnswerSound();
    state.selections[state.questionIndex] = Number(target.dataset.answer);
    saveProgress();
    document.querySelectorAll?.('.choice[data-action="answer"]').forEach((button) => {
      const selected = Number(button.dataset.answer) === state.selections[state.questionIndex];
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-checked", String(selected));
    });
    const count = state.selections.filter((value) => value !== null).length;
    const energy = document.querySelector(".quiz-energy");
    if (energy) energy.textContent = `${count} / ${getQuestions().length} 已入阵`;
    const remaining = document.querySelector(".quiz-prompt span:last-child");
    if (remaining) remaining.textContent = count < getQuestions().length ? `还剩 ${getQuestions().length - count} 题` : "题目已完成";
    const note = document.querySelector(".quiz-footnote");
    if (note) note.textContent = "已记录 · 你可以继续，也可以返回修改。";
    document.querySelectorAll?.(".quiz-momentum i").forEach((node, index) => node.classList.toggle("is-done", state.selections[index] !== null));
  }
  if (action === "prev" && state.questionIndex > 0) { state.questionIndex -= 1; saveProgress(); render(); }
  if (action === "next") {
    if (state.screen !== "quiz" || event.detail > 1) return;
    const questions = getQuestions();
    if (state.selections[state.questionIndex] === null) { toast("选一个最接近你直觉的答案"); return; }
    if (state.questionIndex < questions.length - 1) { state.questionIndex += 1; saveProgress(); render(); }
    else {
      const missing = questions.findIndex((_, index) => !Number.isInteger(state.selections[index]) || state.selections[index] < 0 || state.selections[index] >= options.length);
      if (missing !== -1) {
        state.questionIndex = missing;
        render();
        toast("还有题目未完成，请先补充这一题");
        return;
      }
      const points = meta().scale === "2—10 分" ? [2, 4, 6, 8, 10] : [1, 2, 3, 4, 5];
      state.score = state.selections.reduce((sum, value) => sum + (value === null ? points[2] : points[value]), 0);
      try { localStorage.removeItem(progressKey); } catch {}
      go("result");
    }
  }
  if (action === "to-glyph") go("glyph");
  if (action === "burn") { state.burning = false; state.burnStage = "ready"; state.burnToken += 1; go("burn"); }
  if (action === "ignite") {
    if (state.burning || state.screen !== "burn") return;
    state.burning = true;
    state.burnStage = "prayer";
    const token = ++state.burnToken;
    render();
    window.setTimeout(() => {
      if (state.burnToken !== token || state.screen !== "burn") return;
      state.burnStage = "ignite";
      render();
    }, 3000);
  }
  if (action === "skip-burn") { state.burnToken += 1; state.burning = false; state.burnStage = "ready"; go("share"); }
  if (action === "wallpaper") { state.wallpaper = target.dataset.wallpaper; render(); }
  if (action === "share") {
    const localOnly = ["localhost", "127.0.0.1", "::1", "[::1]"].includes(location.hostname);
    const text = `我在朝·广州获得了「${meta().glyph}」${meta().label}。愿今天的心愿都有回响。`;
    const payload = { title: "朝·广州｜我的好运符文", text };
    if (!localOnly) payload.url = new URL("./", location.href).href;
    target.disabled = true;
    try {
      if (navigator.share) {
        await navigator.share(payload);
      } else {
        const copyText = payload.url ? `${text}\n${payload.url}` : text;
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(copyText);
          toast(localOnly ? "分享文案已复制；当前本地链接仅本机可访问" : "分享文案和链接已复制");
        } else {
          window.prompt("复制这段话，分享你的好运", copyText);
        }
      }
    } catch (error) {
      if (error.name !== "AbortError") toast("暂时无法打开分享，请保存壁纸后分享");
    } finally {
      target.disabled = false;
    }
  }
  if (action === "save") {
    const link = document.createElement("a");
    link.href = state.wallpaper;
    link.download = `朝广州-${meta().label}-符文.${state.wallpaper.split(".").pop()}`;
    link.click();
    toast("壁纸已开始保存");
  }
  if (action === "save-all") {
    const originalText = target.textContent;
    const category = meta();
    target.disabled = true;
    target.textContent = "正在打包两张原图…";
    try {
      const files = await Promise.all(category.shareWallpapers.map(async (item, index) => {
        const response = await fetch(item.src);
        if (!response.ok) throw new Error("图片读取失败");
        return { name: `${index + 1}-${item.label}.${item.src.split(".").pop()}`, data: new Uint8Array(await response.arrayBuffer()) };
      }));
      const url = URL.createObjectURL(wallpaperArchive(files));
      const link = document.createElement("a");
      link.href = url;
      link.download = `朝广州-${category.glyph}-双壁纸.zip`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 60000);
      toast("已发起下载，解压 ZIP 即可获得两张原图");
    } catch {
      toast("壁纸打包失败，请检查网络后重试");
    } finally {
      target.disabled = false;
      target.textContent = originalText;
    }
  }
  if (action === "secrets") go("secrets");
  if (action === "reset") {
    try { localStorage.removeItem(progressKey); } catch {}
    state.selections = Array(getQuestions().length).fill(null);
    state.questionIndex = 0;
    state.burning = false;
    state.burnStage = "ready";
    state.burnToken += 1;
    state.loadingToken += 1;
    go("home");
  }
});

motionPreference.addEventListener("change", () => {
  const video = document.querySelector("#ritual-video");
  if (motionPreference.matches && video) {
    video.pause();
    video.controls = true;
    const status = app.querySelector(".cinema-status");
    status.hidden = false;
    status.textContent = "已减少动态效果，轻触播放或跳过动画";
  } else if (state.screen === "loading") render();
});
render();
