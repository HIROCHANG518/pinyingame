const initials = ["b","p","m","f","d","t","n","l","g","k","h","j","q","x","zh","ch","sh","r","z","c","s","y","w"];
const finalGroups = [
  ["常见", ["a","o","e","i","u","ü"]],
  ["复合", ["ai","ei","ui","ao","ou","iu","ie","üe","er","ua","uo","uai","uan","ian","iang","ia","iao"]],
  ["前鼻音", ["an","en","in","un","ün"]],
  ["后鼻音", ["ang","eng","ing","ong"]],
  ["易混", ["an","ang","en","eng","in","ing","u","ü","üe"]],
  ["福州人易混音", ["f/h","n/l/r"]]
];
const toneNames = ["轻声", "一声", "二声", "三声", "四声"];
const toneMarks = {
  a: ["a","ā","á","ǎ","à"], o: ["o","ō","ó","ǒ","ò"], e: ["e","ē","é","ě","è"],
  i: ["i","ī","í","ǐ","ì"], u: ["u","ū","ú","ǔ","ù"], "ü": ["ü","ǖ","ǘ","ǚ","ǜ"]
};
const words = [
  ["b","a",1,"八"],["b","a",2,"拔"],["b","a",3,"把"],["b","a",4,"爸"],["p","a",2,"爬"],["m","a",1,"妈"],["m","a",3,"马"],["f","a",3,"法"],["d","a",4,"大"],["t","a",1,"他"],
  ["n","a",3,"哪"],["l","a",1,"拉"],["g","e",1,"哥"],["k","e",4,"课"],["h","e",2,"河"],["j","i",1,"鸡"],["q","i",2,"旗"],["x","i",3,"洗"],["zh","i",1,"知"],["ch","i",1,"吃"],
  ["sh","i",1,"诗"],["r","i",4,"日"],["z","i",4,"字"],["c","i",2,"词"],["s","i",1,"思"],["y","i",1,"一"],["w","u",3,"五"],["b","ai",2,"白"],["p","ai",1,"拍"],["m","ai",3,"买"],
  ["f","ei",1,"飞"],["d","ui",4,"对"],["t","ui",3,"腿"],["n","ao",3,"脑"],["l","ao",3,"老"],["g","ou",3,"狗"],["k","ou",3,"口"],["h","ou",2,"猴"],["j","iu",3,"九"],["q","iu",2,"球"],
  ["x","üe",2,"学"],["zh","ao",3,"找"],["ch","ao",1,"超"],["sh","ou",3,"手"],["r","ou",4,"肉"],["z","ao",3,"早"],["c","ao",3,"草"],["s","ao",3,"扫"],["b","an",1,"班"],["p","an",2,"盘"],
  ["m","en",2,"门"],["f","an",4,"饭"],["d","an",4,"蛋"],["t","ian",1,"天"],["n","ian",2,"年"],["l","ian",3,"脸"],["g","ang",1,"刚"],["k","an",4,"看"],["h","ong",2,"红"],["j","ing",1,"京"],
  ["q","ing",2,"晴"],["x","ing",1,"星"],["zh","ong",1,"中"],["ch","eng",2,"成"],["sh","ang",4,"上"],["r","ang",4,"让"],["z","eng",1,"增"],["c","eng",2,"层"],["s","ong",1,"松"],["g","ua",1,"瓜"],
  ["k","ua",1,"夸"],["h","ua",1,"花"],["d","uo",1,"多"],["t","uo",1,"拖"],["g","uai",1,"乖"],["k","uai",4,"快"],["h","uai",4,"坏"],["j","ia",1,"家"],["q","ia",4,"恰"],["x","ia",4,"下"],
  ["b","ian",1,"边"],["p","ian",4,"片"],["m","ian",4,"面"],["d","ian",4,"电"],["l","iang",3,"两"],["j","iang",1,"江"],["q","iang",2,"墙"],["x","iang",1,"香"],["zh","uan",3,"转"],["ch","uan",2,"船"],
  ["sh","uan",1,"栓"],["z","an",4,"赞"],["zh","ang",3,"长"],["c","an",1,"参"],["ch","eng",1,"称"],["s","en",1,"森"],["sh","eng",1,"生"],["l","in",2,"林"],["l","ing",2,"铃"],["n","an",2,"难"]
];

const fuzhouWords = [
  ["f","an",4,"饭"],["n","iu",2,"牛"],["r","an",2,"然"],["f","ei",1,"飞"],["l","iu",2,"流"],
  ["r","e",4,"热"],["f","ang",1,"方"],["n","an",2,"南"],["r","en",2,"人"],["f","eng",1,"风"],
  ["l","an",2,"蓝"],["r","en",4,"认"],["f","o",2,"佛"],["n","u",4,"怒"],["r","i",4,"日"],
  ["f","u",1,"夫"],["l","u",4,"路"],["r","ong",2,"荣"],["f","u",2,"福"],["n","ü",3,"女"],
  ["r","ou",4,"肉"],["f","en",1,"分"],["l","ü",3,"旅"],["r","u",2,"如"],["f","an",3,"反"],
  ["n","ei",4,"内"],["r","uan",3,"软"],["f","ou",3,"否"],["l","ei",4,"类"],["r","ui",4,"瑞"],
  ["f","u",4,"复"],["n","ian",2,"年"],["r","uo",4,"若"],["f","an",2,"凡"],["l","ian",2,"连"],
  ["r","un",4,"润"],["n","iang",2,"娘"],["r","eng",1,"扔"],["n","iao",3,"鸟"],["f","a",1,"发"]
];
const allWordCards = [...words, ...fuzhouWords];

const audioManifest = window.PINYIN_AUDIO || { initials: {}, finals: {}, words: {}, phrases: {} };
const commonCharCards = window.COMMON_CHAR_CARDS || [];
const reviewStorageKey = "pinyin-review-cards";
let currentAudio = null;

const state = {
  group: 1, index: 0, selectedInitial: "", selectedFinal: "", selectedTone: 1,
  correct: 0, wrong: [], streak: 0, stars: 0, questions: [], targetCount: 20,
  designMode: false, reviewMode: false
};

const $ = (id) => document.getElementById(id);
const els = {
  initialGrid: $("initialGrid"), finalGroups: $("finalGroups"), progress: $("progressText"),
  groupSlider: $("groupSlider"), groupText: $("groupText"), accuracy: $("accuracyText"),
  streak: $("streakText"), stars: $("starsText"), chosenInitial: $("chosenInitial"),
  chosenFinal: $("chosenFinal"), pinyin: $("pinyinResult"), toneBtns: $("toneBtns"),
  feedback: $("feedback"), stage: $("stage"),
  taskType: $("taskType"), answerBox: $("answerBox"), heardChar: $("heardChar"),
  designWorkspace: $("designWorkspace"), candidateZone: $("candidateZone"), customList: $("customList"),
  questionIndexText: $("questionIndexText"), nextGroupBtn: $("nextGroupBtn")
};

function markedPinyin(initial, final, tone) {
  let f = final.replace("ue", "üe").replace("v", "ü");
  const hideDots = ["j", "q", "x", "y"].includes(initial);
  const vowels = ["a", "o", "e", "i", "u", "ü"];
  let target = ["a", "o", "e"].find((v) => f.includes(v));
  if (!target && f.includes("iu")) target = "u";
  if (!target && f.includes("ui")) target = "i";
  if (!target) target = [...f].reverse().find((v) => vowels.includes(v));
  if (target && tone > 0) f = f.replace(target, toneMarks[target][tone]);
  return initial + (hideDots ? f.replaceAll("ü", "u").replaceAll("ǖ", "ū").replaceAll("ǘ", "ú").replaceAll("ǚ", "ǔ").replaceAll("ǜ", "ù") : f);
}

function groupQuestions(group) {
  if (group === 51 || group === 52) {
    const start = (group - 51) * 20;
    return fuzhouWords.slice(start, start + 20).map((raw) => ({ initial: raw[0], final: raw[1], tone: raw[2], char: raw[3], training: "福州人易混音" }));
  }
  if (group > 52) {
    const start = (group - 53) * 20;
    return customCards().slice(start, start + 20).map((card) => ({ ...card, tone: Number(card.tone), custom: true }));
  }
  const start = ((group - 1) * 17) % words.length;
  return Array.from({ length: 20 }, (_, i) => {
    const raw = words[(start + i * (group < 12 ? 1 : group < 25 ? 3 : group < 40 ? 5 : 7)) % words.length];
    return { initial: raw[0], final: raw[1], tone: raw[2], char: raw[3] };
  });
}

function playAudio(src, fallbackText = "") {
  speechSynthesis.cancel();
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }
  if (!src) {
    console.warn("缺少音频", fallbackText);
    return;
  }
  currentAudio = new Audio(src);
  currentAudio.play().catch(() => console.warn("音频播放失败", fallbackText));
}

function playInitial(initial) {
  playAudio(audioManifest.initials[initial], initial);
}

function playFinal(final) {
  const key = final === "ue" ? "üe" : final;
  playAudio(audioManifest.finals[key] || audioManifest.finals[final], key);
}

function playWord(char) {
  playAudio(audioManifest.words[char], char);
}

function playPhrase(key, fallbackText) {
  playAudio(audioManifest.phrases[key], fallbackText);
}

function playRandomCorrectPhrase() {
  const options = audioManifest.phrases.correctOptions || [];
  if (!options.length) {
    playPhrase("correct", "真棒");
    return;
  }
  playAudio(options[Math.floor(Math.random() * options.length)], "真棒");
}

function speakCurrent() {
  const q = currentQuestion();
  els.heardChar.textContent = q.char;
  playWord(q.char);
}

function currentQuestion() {
  return state.questions[state.index];
}

function dateKey(offset = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function recentReviewCards() {
  const allowed = new Set([dateKey(), dateKey(-1)]);
  const raw = JSON.parse(localStorage.getItem(reviewStorageKey) || "[]");
  const recent = raw.filter((item) => allowed.has(item.date));
  if (recent.length !== raw.length) localStorage.setItem(reviewStorageKey, JSON.stringify(recent));
  return recent;
}

function reviewCardKey(card) {
  return `${card.date}|${card.char}|${card.initial}|${card.final}|${card.tone}`;
}

function addReviewCard(question) {
  const card = {
    date: dateKey(),
    char: question.char,
    initial: question.initial,
    final: question.final,
    tone: Number(question.tone)
  };
  const cards = recentReviewCards();
  const key = reviewCardKey(card);
  if (!cards.some((item) => reviewCardKey(item) === key)) cards.push(card);
  localStorage.setItem(reviewStorageKey, JSON.stringify(cards));
  updateReviewBadge();
}

function updateReviewBadge() {
  const count = recentReviewCards().length;
  $("reviewBtn").textContent = `${count} 题`;
}

function updateGroupRange() {
  const customGroupCount = Math.ceil(customCards().length / 20);
  const maxGroup = Math.max(52, 52 + customGroupCount);
  els.groupSlider.max = String(maxGroup);
  if (state.group > maxGroup) state.group = maxGroup;
}

function resetSelection() {
  state.selectedInitial = "";
  state.selectedFinal = "";
  state.selectedTone = 1;
  els.chosenInitial.textContent = "?";
  els.chosenFinal.textContent = "?";
  els.pinyin.textContent = "?";
  els.answerBox.hidden = true;
  els.heardChar.textContent = "";
  els.stage.className = "stage";
  els.feedback.className = "feedback";
  els.feedback.textContent = "先听汉字，再把它拼出来。";
  document.querySelectorAll(".tile").forEach((b) => { b.classList.remove("selected", "correct-reveal"); });
  $("initCheck").textContent = "";
  $("finalCheck").textContent = "";
  setToneButton(1);
  updateTone();
  updateModeView();
}

function updateStats() {
  const done = state.index;
  els.progress.textContent = `${done}/${state.targetCount}`;
  els.groupText.textContent = state.reviewMode ? "再次练习" : `组 ${state.group}`;
  els.questionIndexText.textContent = `第 ${done}/${state.targetCount} 题`;
  els.accuracy.textContent = `${done ? Math.round(state.correct / done * 100) : 100}%`;
  els.streak.textContent = state.streak;
  els.stars.textContent = state.stars;
  updateReviewBadge();
}

function updateModeView() {
  const design = state.designMode;
  $("toggleDesignerBtn").textContent = design ? "回到练习" : "我来设计";
  els.taskType.textContent = design ? "我来设计" : "两拼：声母 + 韵母";
  $("answerBtn").hidden = design;
  $("replayBtn").hidden = design;
  document.querySelector(".steps").hidden = design;
  els.designWorkspace.hidden = !design;
  els.stage.hidden = design;
  els.heardChar.hidden = false;
  els.pinyin.hidden = false;
  els.stage.classList.remove("designing");
  if (design) {
    els.feedback.textContent = "选声母、韵母和声调，中间会出现备选字。双击确认。";
    renderCandidates();
    drawCustomList();
  }
}

function renderTiles() {
  els.initialGrid.innerHTML = initials.map((v) => `<button class="tile" data-initial="${v}">${v}</button>`).join("");
  els.finalGroups.innerHTML = finalGroups.map(([name, finals]) => `
    <section class="final-section">
      <h3>${name}</h3>
      <div class="final-grid">${finals.map((v) => v.includes("/") ? `<button class="tile final-tile training-chip" disabled>${v}</button>` : `<button class="tile final-tile" data-final="${v}">${v}</button>`).join("")}</div>
    </section>`).join("");
  els.initialGrid.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-initial]");
    if (!btn) return;
    state.selectedInitial = btn.dataset.initial;
    document.querySelectorAll("[data-initial]").forEach((b) => {
      b.classList.remove("correct-reveal");
      b.classList.toggle("selected", b === btn);
    });
    els.chosenInitial.textContent = state.selectedInitial;
    // 立即判断声母是否正确，显示对勾
    const q = currentQuestion();
    if (state.selectedInitial === q.initial) {
      document.querySelector(`[data-initial="${q.initial}"]`)?.classList.add("correct-reveal");
      $("initCheck").textContent = "✅";
    } else {
      $("initCheck").textContent = "";
    }
    playInitial(state.selectedInitial);
    if (state.designMode) {
      updateTone();
      renderCandidates();
      return;
    }
    setTimeout(checkAnswer, 260);
  });
  els.finalGroups.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-final]");
    if (!btn) return;
    state.selectedFinal = btn.dataset.final;
    document.querySelectorAll("[data-final]").forEach((b) => {
      b.classList.remove("correct-reveal");
      b.classList.toggle("selected", b === btn);
    });
    els.chosenFinal.textContent = state.selectedFinal;
    // 立即判断韵母是否正确，显示对勾
    const q = currentQuestion();
    if (state.selectedFinal === q.final) {
      document.querySelector(`[data-final="${q.final}"]`)?.classList.add("correct-reveal");
      $("finalCheck").textContent = "✅";
    } else {
      $("finalCheck").textContent = "";
    }
    playFinal(state.selectedFinal);
    if (state.designMode) {
      updateTone();
      renderCandidates();
      return;
    }
    setTimeout(checkAnswer, 260);
  });
}

function tileButton(value, attr, extraClass = "") {
  return `<button class="tile ${extraClass}" ${attr}="${value}">${value}</button>`;
}

function setToneButton(tone) {
  document.querySelectorAll(".tone-btn").forEach((b) => {
    b.classList.toggle("active", Number(b.dataset.tone) === tone);
  });
}

function updateTone() {
  if (state.selectedInitial && state.selectedFinal) {
    els.pinyin.textContent = markedPinyin(state.selectedInitial, state.selectedFinal, state.selectedTone);
  } else {
    els.pinyin.textContent = toneNames[state.selectedTone].replace("声", "");
  }
}

function checkAnswer() {
  if (state.designMode) return;
  updateTone();
  if (!state.selectedInitial || !state.selectedFinal) return;
  const q = currentQuestion();
  const sameSound = state.selectedInitial === q.initial && state.selectedFinal === q.final;
  const exact = sameSound && state.selectedTone === q.tone;

  // 对勾标志：声母/韵母选对时在按钮上显示 ✓
  const initCorrect = state.selectedInitial === q.initial;
  const finalCorrect = state.selectedFinal === q.final;
  document.querySelectorAll("[data-initial]").forEach((b) => {
    b.classList.remove("correct-reveal");
    if (initCorrect && b.dataset.initial === q.initial) b.classList.add("correct-reveal");
  });
  document.querySelectorAll("[data-final]").forEach((b) => {
    b.classList.remove("correct-reveal");
    if (finalCorrect && b.dataset.final === q.final) b.classList.add("correct-reveal");
  });

  // 中间区域标识位：每个 piece 上方独立显示 ✅
  $("initCheck").textContent = initCorrect ? "✅" : "";
  $("finalCheck").textContent = finalCorrect ? "✅" : "";

  if (exact) {
    finishQuestion("correct", `答对啦！${q.char}，${markedPinyin(q.initial, q.final, q.tone)} ✨`);
  } else if (sameSound) {
    showFeedback("tone", "音调快对上啦，再听一次试试 🙂");
    playWord(q.char);
  } else {
    showFeedback("wrong", "再想想 🙁");
  }
}

function showFeedback(kind, text) {
  els.stage.className = `stage ${kind}`;
  els.feedback.className = `feedback ${kind}`;
  els.feedback.textContent = text;
}

function finishQuestion(kind, text) {
  const q = currentQuestion();
  showFeedback(kind, text);
  state.correct += 1;
  state.streak += 1;
  state.stars += 1;
  playRandomCorrectPhrase();
  setTimeout(nextQuestion, 950);
}

function markWrong(reason) {
  const q = currentQuestion();
  if (q.answerShown) return;
  q.answerShown = true;
  state.wrong.push({ ...q, reason });
  state.streak = 0;
}

function nextQuestion() {
  state.index += 1;
  if (state.index >= state.targetCount) return finishPractice();
  resetSelection();
  updateStats();
  setTimeout(speakCurrent, 250);
}

function finishPractice() {
  $("summaryPanel").hidden = false;
  $("summaryText").textContent = `本组答对 ${state.correct} 题，正确率 ${Math.round(state.correct / state.targetCount * 100)}%。`;
  $("wrongList").innerHTML = state.wrong.length ? state.wrong.map((q) => `<p>${q.char}：${markedPinyin(q.initial, q.final, q.tone)}，${q.reason}</p>`).join("") : "<p>这组没有待提高题目。</p>";
  playPhrase("finish", "轩瑞你又进步啦，爱你哦");
}

function startGroup(group = state.group) {
  updateGroupRange();
  state.reviewMode = false;
  state.group = group;
  state.questions = groupQuestions(group);
  if (!state.questions.length) {
    state.group = 1;
    state.questions = groupQuestions(1);
  }
  state.targetCount = state.questions.length;
  state.index = 0;
  state.correct = 0;
  state.wrong = [];
  state.streak = 0;
  $("summaryPanel").hidden = true;
  els.groupSlider.value = String(state.group);
  els.groupText.textContent = state.reviewMode ? "再次练习" : `组 ${state.group}`;
  resetSelection();
  updateStats();
  setTimeout(speakCurrent, 350);
}

function startReviewPractice() {
  const cards = recentReviewCards().map((card) => ({ ...card, tone: Number(card.tone), review: true }));
  if (!cards.length) {
    showFeedback("tone", "昨天和今天还没有需要再次练习的题。");
    return;
  }
  state.reviewMode = true;
  state.group = 0;
  state.questions = cards;
  state.targetCount = cards.length;
  state.index = 0;
  state.correct = 0;
  state.wrong = [];
  state.streak = 0;
  $("summaryPanel").hidden = true;
  resetSelection();
  els.groupText.textContent = "再次练习";
  updateStats();
  setTimeout(speakCurrent, 350);
}

function showAnswer() {
  const q = currentQuestion();
  markWrong("看了答案");
  addReviewCard(q);
  state.selectedInitial = q.initial;
  state.selectedFinal = q.final;
  state.selectedTone = q.tone;
  setToneButton(q.tone);
  els.chosenInitial.textContent = q.initial;
  els.chosenFinal.textContent = q.final;
  els.pinyin.textContent = markedPinyin(q.initial, q.final, q.tone);
  els.heardChar.textContent = q.char;
  els.answerBox.hidden = false;
  els.answerBox.innerHTML = `答案：<strong>${q.char}</strong>，声母 <strong>${q.initial}</strong>，韵母 <strong>${q.final}</strong>，${toneNames[q.tone]}，<strong>${markedPinyin(q.initial, q.final, q.tone)}</strong> <button id="nextAfterAnswerBtn">下一题</button>`;
  showFeedback("wrong", "答案在下面，可以听完后进入下一题。");
  playWord(q.char);
  updateStats();
}

function renderDesigner() {
  drawCustomList();
  updateGroupRange();
}

function customCards() {
  return JSON.parse(localStorage.getItem("pinyin-custom-cards") || "[]");
}

function saveCustomCards(cards) {
  localStorage.setItem("pinyin-custom-cards", JSON.stringify(cards));
  updateGroupRange();
}

function drawCustomList() {
  const cards = customCards();
  els.customList.innerHTML = cards.length ? cards.map((c, i) => `
    <div class="custom-card">
      <span>${c.char} ${markedPinyin(c.initial, c.final, Number(c.tone))}</span>
      <span><button data-listen-custom="${i}">听</button><button data-del="${i}">删除</button></span>
    </div>`).join("") : "<strong>还没有自定义字卡，可以先设计一个。</strong>";
}

function renderCandidates() {
  const zone = els.candidateZone;
  if (!state.designMode) return;
  if (!state.selectedInitial || !state.selectedFinal) {
    zone.textContent = "先选声母和韵母";
    return;
  }
  const list = commonCharCards
    .filter((item) => item.initial === state.selectedInitial && item.final === state.selectedFinal && Number(item.tone) === state.selectedTone)
    .slice(0, 48);
  if (!list.length) {
    zone.innerHTML = `<div class="empty-candidates">${markedPinyin(state.selectedInitial, state.selectedFinal, state.selectedTone)} 暂无备选字</div>`;
    return;
  }
  zone.innerHTML = list.map((item) => `
    <button class="candidate-card" data-candidate='${JSON.stringify(item)}'>
      <strong>${item.char}</strong>
      <span>${markedPinyin(item.initial, item.final, Number(item.tone))}</span>
    </button>`).join("");
}

function addCustomCard(card) {
  const cards = customCards();
  const exists = cards.some((item) => item.char === card.char && item.initial === card.initial && item.final === card.final && Number(item.tone) === Number(card.tone));
  if (!exists) cards.push(card);
  saveCustomCards(cards);
  drawCustomList();
  const group = 52 + Math.ceil(cards.length / 20);
  state.group = group;
  els.groupSlider.value = String(group);
  updateStats();
}

renderTiles();
renderDesigner();
// 声调按键点击
els.toneBtns.addEventListener("click", (e) => {
  const btn = e.target.closest(".tone-btn");
  if (!btn) return;
  state.selectedTone = Number(btn.dataset.tone);
  setToneButton(state.selectedTone);
  updateTone();
  if (state.designMode) {
    renderCandidates();
    return;
  }
  if (state.selectedInitial && state.selectedFinal) {
    const q = currentQuestion();
    const exactSound = q && state.selectedInitial === q.initial && state.selectedFinal === q.final;
    if (exactSound) playWord(q.char);
  }
  checkAnswer();
});
$("replayBtn").addEventListener("click", speakCurrent);
$("answerBtn").addEventListener("click", showAnswer);
$("answerBox").addEventListener("click", (e) => {
  if (e.target.closest("#nextAfterAnswerBtn")) nextQuestion();
});
$("startGroupBtn").addEventListener("click", () => startGroup(Number(els.groupSlider.value)));
$("reviewBtn").addEventListener("click", startReviewPractice);
els.groupSlider.addEventListener("input", () => {
  state.reviewMode = false;
  state.group = Number(els.groupSlider.value);
  els.groupText.textContent = `组 ${state.group}`;
});
$("finishBtn").addEventListener("click", finishPractice);
// 下一组按钮
els.nextGroupBtn.addEventListener("click", () => {
  const next = state.reviewMode ? 1 : state.group + 1;
  const maxGroup = Number(els.groupSlider.max);
  const target = next > maxGroup ? 1 : next;
  els.groupSlider.value = String(target);
  startGroup(target);
});
$("toggleDesignerBtn").addEventListener("click", () => {
  state.designMode = !state.designMode;
  resetSelection();
  updateModeView();
});
$("candidateZone").addEventListener("dblclick", (e) => {
  const btn = e.target.closest("[data-candidate]");
  if (!btn) return;
  addCustomCard(JSON.parse(btn.dataset.candidate));
});
$("customList").addEventListener("click", (e) => {
  const listen = e.target.closest("[data-listen-custom]");
  const del = e.target.closest("[data-del]");
  const cards = customCards();
  if (listen) {
    const c = cards[Number(listen.dataset.listenCustom)];
    playWord(c.char);
  }
  if (del) {
    cards.splice(Number(del.dataset.del), 1);
    saveCustomCards(cards);
    drawCustomList();
    updateStats();
  }
});
window.speechSynthesis.onvoiceschanged = () => {};
updateGroupRange();
updateReviewBadge();
startGroup(1);
