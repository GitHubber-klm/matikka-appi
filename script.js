let operation = "add";
let max = 10;
let a = 0;
let b = 0;
let currentQuestion = 0;
let correctAnswers = 0;
let score = 0;
let timer = 10;
let timerInterval = null;
let inBonusTime = false;

// Monikielisyys
let currentLang = "fi";
let i18n = {}; // tähän ladataan valitun kielen tekstit

const translations = {
  fi: {
    scoreLabel: "Pisteet: {score}",
    mustChooseTable: "Valitse vähintään yksi kertotaulu!",
    timeUp: "⏰ Aika loppui! Oikea vastaus oli {answer}",
    mustAnswer: "⚠️ Kirjoita vastaus!",
    correct: "👍 Oikein!",
    wrong: "❌ Väärin! Oikea vastaus on {answer}",
    summary: "{avatar} {name}, sait {correct}/10 oikein ja keräsit {score} pistettä! 🎯",
    newRecord: "🎉 Uusi ennätys!",
    bestScore: "Paras tulos: {score} pistettä",
    shareText: "{name} sai {correct}/10 oikein ja {score} pistettä matikkapelissä! Kokeile sinäkin!"
  },
  en: {
    scoreLabel: "Score: {score}",
    mustChooseTable: "Select at least one multiplication table!",
    timeUp: "⏰ Time’s up! The correct answer was {answer}",
    mustAnswer: "⚠️ Please enter an answer!",
    correct: "👍 Correct!",
    wrong: "❌ Wrong! The correct answer is {answer}",
    summary: "{avatar} {name}, you got {correct}/10 correct and scored {score} points! 🎯",
    newRecord: "🎉 New record!",
    bestScore: "Best score: {score} points",
    shareText: "{name} got {correct}/10 correct and {score} points in Math Game! Try it too!"
  }
};

function updateLanguage(lang) {
  currentLang = lang;
  i18n = translations[lang];
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (i18n[key]) el.textContent = i18n[key];
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (i18n[key]) el.placeholder = i18n[key];
  });
}

function startGame() {
  document.querySelector(".setup").classList.add("hidden");
  operation = document.getElementById("operationSelect").value;
  max = parseInt(document.getElementById("maxNumber").value);
  currentQuestion = 0;
  correctAnswers = 0;
  score = 0;
  // document.getElementById("scoreDisplay").textContent = "Pisteet: 0";
  document.getElementById("scoreDisplay").textContent = i18n.scoreLabel.replace("{score}", 0);

  const name = document.getElementById("userName").value.trim();
  const avatar = document.getElementById("avatar").value;
  const theme = document.getElementById("themeSelect").value;

  localStorage.setItem("userName", name);
  localStorage.setItem("avatar", avatar);
  localStorage.setItem("theme", theme);

  updateTheme(theme);

  document.querySelector(".summary").classList.add("hidden");
  document.querySelector(".game").classList.remove("hidden");

  nextQuestion();
}

function getSelectedTables() {
  const checkboxes = document.querySelectorAll("#multiplicationOptions input[type='checkbox']:checked");
  return Array.from(checkboxes).map(cb => parseInt(cb.value));
}

function nextQuestion() {
  if (currentQuestion >= 10) {
    showSummary();
    return;
  }

  if (operation === "mul") {
    const selectedTables = getSelectedTables();
    if (selectedTables.length === 0) {
      // alert("Valitse vähintään yksi kertotaulu!");
      alert(i18n.mustChooseTable);
      goToStart();
      return;
    }
    a = selectedTables[Math.floor(Math.random() * selectedTables.length)];
    b = Math.floor(Math.random() * (max + 1));
  } else {
    a = Math.floor(Math.random() * (max + 1));
    b = Math.floor(Math.random() * (max + 1));
    if (operation === "sub" && a < b) [a, b] = [b, a];
  }

  const symbol = { add: "+", sub: "−", mul: "×" }[operation];
  document.getElementById("question").textContent = `${a} ${symbol} ${b} = ?`;
  document.getElementById("answer").value = "";
  document.getElementById("feedback").textContent = "";
  document.getElementById("feedback").className = "";
  document.getElementById("answer").focus();

  clearInterval(timerInterval);
  timer = 10;
  inBonusTime = false;
  document.getElementById("timer").textContent = `⏳ ${timer} s`;
  document.getElementById("timer").style.color = "black";

  timerInterval = setInterval(() => {
    if (!inBonusTime) {
      timer--;
      document.getElementById("timer").textContent = `⏳ ${timer} s`;
      if (timer <= 0) {
        inBonusTime = true;
        timer = 5;
        document.getElementById("timer").style.color = "red";
        document.getElementById("timer").textContent = `⏳ ${timer} s`;
      }
    } else {
      timer--;
      document.getElementById("timer").textContent = `⏳ ${timer} s`;
      if (timer <= 0) {
        clearInterval(timerInterval);
        // document.getElementById("feedback").textContent = `⏰ Aika loppui! Oikea vastaus oli ${getCorrectAnswer()}`;
        document.getElementById("feedback").textContent =
          i18n.timeUp.replace("{answer}", getCorrectAnswer());
        document.getElementById("feedback").className = "wrong";
        setTimeout(nextQuestion, 1500);
      }
    }
  }, 1000);

  currentQuestion++;
}

function checkAnswer() {
  clearInterval(timerInterval);
  const input = document.getElementById("answer");
  const userAnswer = parseInt(input.value);
  const correct = getCorrectAnswer();
  const feedback = document.getElementById("feedback");

  if (isNaN(userAnswer)) {
    // feedback.textContent = "⚠️ Kirjoita vastaus!";
    feedback.textContent = i18n.mustAnswer;
    feedback.className = "wrong";
    input.focus();
    return;
  }

  if (userAnswer === correct) {
    // feedback.textContent = "👍 Oikein!";
    feedback.textContent = i18n.correct;
    feedback.className = "correct";
    correctAnswers++;

    if (!inBonusTime) {
      score += timer;
    }
    // document.getElementById("scoreDisplay").textContent = `Pisteet: ${score}`;
    document.getElementById("scoreDisplay").textContent =
      i18n.scoreLabel.replace("{score}", score);
  } else {
    // feedback.textContent = `❌ Väärin! Oikea vastaus on ${correct}`;
    feedback.textContent = i18n.wrong.replace("{answer}", correct);
    feedback.className = "wrong";
  }

  setTimeout(nextQuestion, 1500);
}

function getCorrectAnswer() {
  return operation === "add" ? a + b : operation === "sub" ? a - b : a * b;
}

function showSummary() {
  document.querySelector(".game").classList.add("hidden");
  document.querySelector(".summary").classList.remove("hidden");

  const name = localStorage.getItem("userName") || "Pelaaja";
  const avatar = localStorage.getItem("avatar") || "😊";
  const summary = document.getElementById("summaryText");
  // summary.textContent = `${avatar} ${name}, sait ${correctAnswers}/10 oikein ja keräsit ${score} pistettä! 🎯`;
  summary.textContent = i18n.summary
    .replace("{avatar}", avatar)
    .replace("{name}", name)
    .replace("{correct}", correctAnswers)
    .replace("{score}", score);

  const currentSettings = {
    operation: operation,
    max: max,
    tables: operation === "mul" ? getSelectedTables() : null,
  };

  const saved = JSON.parse(localStorage.getItem("bestScoreData") || "null");

  if (!saved || score > saved.score) {
    localStorage.setItem("bestScoreData", JSON.stringify({
      score,
      settings: currentSettings
    }));
    // document.getElementById("highScoreText").textContent = "🎉 Uusi ennätys!";
    document.getElementById("highScoreText").textContent = i18n.newRecord;
  } else {
    // document.getElementById("highScoreText").textContent =
    //   `Paras tulos: ${saved.score} pistettä\n(${formatSettings(saved.settings)})`;
    document.getElementById("highScoreText").textContent =
      i18n.bestScore.replace("{score}", saved.score)
      + `\n(${formatSettings(saved.settings)})`;
  }
}

function goToStart() {
  document.querySelector(".setup").classList.remove("hidden");
  document.querySelector(".summary").classList.add("hidden");
  document.querySelector(".game").classList.add("hidden");
}

function toggleAllTables() {
  const checkboxes = document.querySelectorAll("#multiplicationOptions input[type='checkbox']");
  const allChecked = Array.from(checkboxes).every(cb => cb.checked);
  checkboxes.forEach(cb => (cb.checked = !allChecked));
  // document.getElementById("toggleAllTables").textContent = allChecked ? "Valitse kaikki" : "Poista kaikki";
  document.getElementById("toggleAllTables").textContent = allChecked ? i18n.selectAll : i18n.deselectAll;
}

function shareResult() {
  const name = localStorage.getItem("userName") || "Pelaaja";
  // const shareText = `${name} sai ${correctAnswers}/10 oikein ja ${score} pistettä matikkapelissä! Kokeile sinäkin!`;
  const shareText = i18n.shareText
    .replace("{name}", name)
    .replace("{correct}", correctAnswers)
    .replace("{score}", score);

  if (navigator.share) {
    navigator.share({
      title: "Matikka Appi",
      text: shareText,
      url: window.location.href
    }).catch(console.error);
  } else {
    alert("Jakaminen ei ole tuettu tällä laitteella.");
  }
}

function updateTheme(theme) {
  document.body.classList.remove("theme-light", "theme-blue", "theme-forest", "theme-space");
  document.body.classList.add(`theme-${theme}`);
}

document.addEventListener("DOMContentLoaded", () => {
  const setupEl = document.querySelector(".setup");
  const gameEl = document.querySelector(".game");
  const summaryEl = document.querySelector(".summary");

  if (setupEl && gameEl && summaryEl) {
    gameEl.classList.add("hidden");
    summaryEl.classList.add("hidden");
    setupEl.classList.remove("hidden");
  }

  // theme-vaihto
  const themeSelect = document.getElementById("themeSelect");
  themeSelect.addEventListener("change", () => {
    updateTheme(themeSelect.value);
  });

  const savedTheme = localStorage.getItem("theme") || "light";
  updateTheme(savedTheme);
  document.getElementById("themeSelect").value = savedTheme;

  // nimi tallentuu localStorageen heti kun kirjoitetaan
  const userNameInput = document.getElementById("userName");
  const savedName = localStorage.getItem("userName") || "";
  userNameInput.value = savedName;
  userNameInput.addEventListener("input", () => {
    localStorage.setItem("userName", userNameInput.value.trim());
  });

// ✅ Enter-näppäin tarkistaa vastauksen
const answerInput = document.getElementById("answer");
answerInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    checkAnswer();
  }
});

// ✅ Näytä/piilota kertotauluvalinnat
const operationSelect = document.getElementById("operationSelect");
const multOptions = document.getElementById("multiplicationOptions");

operationSelect.addEventListener("change", () => {
  if (operationSelect.value === "mul") {
    multOptions.classList.remove("hidden");
  } else {
    multOptions.classList.add("hidden");
  }
});

// Käynnistä oikealla tilalla kun sivu ladataan
if (operationSelect.value === "mul") {
  multOptions.classList.remove("hidden");
} else {
  multOptions.classList.add("hidden");
}

  // aloituskieli
  updateLanguage(currentLang);
});

function formatSettings(s) {
  let text = "";
  if (s.operation === "add") text += currentLang === "fi" ? "Yhteenlasku" : "Addition";
  else if (s.operation === "sub") text += currentLang === "fi" ? "Vähennyslasku" : "Subtraction";
  else if (s.operation === "mul") text += currentLang === "fi" ? "Kertolasku" : "Multiplication";

  text += `, 0–${s.max}`;
  if (s.operation === "mul" && s.tables) {
    text += currentLang === "fi" ? `, taulut: ${s.tables.join(", ")}` : `, tables: ${s.tables.join(", ")}`;
  }
  return text;
}
