let operation = "add";
let max = 10;
let a = 0;
let b = 0;
let currentQuestion = 0;
let correctAnswers = 0;
let score = 0;
let timer = 10;
let timerInterval = null;



function startGame() {
  operation = document.getElementById("operationSelect").value;
  max = parseInt(document.getElementById("maxNumber").value);
  currentQuestion = 0;
  correctAnswers = 0;
  score = 0;
  document.getElementById("scoreDisplay").textContent = "Pisteet: 0";


  // Tallenna asetukset
  const name = document.getElementById("userName").value.trim();
  const avatar = document.getElementById("avatar").value;
  const theme = document.getElementById("themeSelect").value;

  localStorage.setItem("userName", name);
  localStorage.setItem("avatar", avatar);
  localStorage.setItem("theme", theme);

  // Aseta teema
  document.body.className = `theme-${theme}`;

  document.querySelector(".setup").classList.add("hidden");
  document.querySelector(".summary").classList.add("hidden");
  document.querySelector(".game").classList.remove("hidden");

  nextQuestion();
}

function getSelectedTables() {
  const checkboxes = document.querySelectorAll("#multiplicationOptions input[type='checkbox']:checked");
  return Array.from(checkboxes).map(cb => parseInt(cb.value));
}

let isLateAnswer = false;

function nextQuestion() {
  if (currentQuestion >= 10) {
    showSummary();
    return;
  }

  if (operation === "mul") {
    const selectedTables = getSelectedTables();
    if (selectedTables.length === 0) {
      alert("Valitse vähintään yksi kertotaulu!");
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
  isLateAnswer = false;

  document.getElementById("timer").textContent = `⏳ ${timer} s`;

  timerInterval = setInterval(() => {
    timer--;
    document.getElementById("timer").textContent = `⏳ ${timer} s`;

    if (timer === 0 && !isLateAnswer) {
      isLateAnswer = true;
      document.getElementById("feedback").textContent = `⏰ Aika loppui! Oikea vastaus oli ${getCorrectAnswer()}. Vastaa silti – et saa pisteitä, mutta voit saada hyvän vastauksen!`;
      document.getElementById("feedback").className = "wrong";
    }

    if (timer <= -5) {
      clearInterval(timerInterval);
      document.getElementById("feedback").textContent = `❌ Et vastannut ajoissa.`;
      document.getElementById("feedback").className = "wrong";
      setTimeout(nextQuestion, 1500);
    }
  }, 1000);

  currentQuestion++;
}


function checkAnswer() {
  clearInterval(timerInterval); // pysäyttää ajastimen heti kun vastataan
  const input = document.getElementById("answer");
  const userAnswer = parseInt(input.value);
  let correct = operation === "add" ? a + b : operation === "sub" ? a - b : a * b;

  const feedback = document.getElementById("feedback");

  if (isNaN(userAnswer)) {
    feedback.textContent = "⚠️ Kirjoita vastaus!";
    feedback.className = "wrong";
    input.focus();
    return;
  }

  if (userAnswer === correct) {
    if (!isLateAnswer) {
      feedback.textContent = "👍 Oikein!";
      score += timer;
    } else {
      feedback.textContent = "✅ Oikein (ilman pisteitä)";
    }
    correctAnswers++;
    feedback.className = "correct";
    document.getElementById("scoreDisplay").textContent = `Pisteet: ${score}`;
  } else {
    feedback.textContent = `❌ Väärin! Oikea vastaus on ${correct}`;
    feedback.className = "wrong";
  }

  setTimeout(nextQuestion, 1500);
}


function showSummary() {
  document.querySelector(".game").classList.add("hidden");
  document.querySelector(".summary").classList.remove("hidden");

  const name = localStorage.getItem("userName") || "Pelaaja";
  const avatar = localStorage.getItem("avatar") || "😊";
  const summary = document.getElementById("summaryText");
  summary.textContent = `${avatar} ${name}, sait ${correctAnswers}/10 oikein ja keräsit ${score} pistettä! 🎯`;

const currentSettings = {
  operation: operation,
  max: max,
  tables: operation === "mul" ? getSelectedTables() : null,
};

// Tarkistetaan paras pistemäärä
const saved = JSON.parse(localStorage.getItem("bestScoreData") || "null");

if (!saved || score > saved.score) {
  localStorage.setItem("bestScoreData", JSON.stringify({
    score,
    settings: currentSettings
  }));
  document.getElementById("highScoreText").textContent = "🎉 Uusi ennätys!";
} else {
  document.getElementById("highScoreText").textContent =
    `Paras tulos: ${saved.score} pistettä\n(${formatSettings(saved.settings)})`;
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
  document.getElementById("toggleAllTables").textContent = allChecked ? "Valitse kaikki" : "Poista kaikki";
}

function shareResult() {
  const name = localStorage.getItem("userName") || "Pelaaja";
  const scoreText = `${correctAnswers}/10 ja ${score} pistettä`;
  const shareText = `${name} sai ${scoreText} matikkapelissä! Kokeile sinäkin!`;


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

document.addEventListener("DOMContentLoaded", () => {
  const answerInput = document.getElementById("answer");
  answerInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") checkAnswer();
  });

  // Näytä kertotaulut vain ×:ssä
  const opSelect = document.getElementById("operationSelect");
  opSelect.addEventListener("change", () => {
    const show = opSelect.value === "mul";
    document.getElementById("multiplicationOptions").classList.toggle("hidden", !show);
  });

  // Lataa tallennetut asetukset
  const savedTheme = localStorage.getItem("theme") || "light";
  const savedName = localStorage.getItem("userName") || "";
  const savedAvatar = localStorage.getItem("avatar") || "🐱";

  document.body.className = `theme-${savedTheme}`;
  document.getElementById("themeSelect").value = savedTheme;
  document.getElementById("userName").value = savedName;
  document.getElementById("avatar").value = savedAvatar;
});

function formatSettings(s) {
  let text = "";
  if (s.operation === "add") text += "Yhteenlasku";
  else if (s.operation === "sub") text += "Vähennyslasku";
  else if (s.operation === "mul") text += "Kertolasku";

  text += `, 0–${s.max}`;
  if (s.operation === "mul" && s.tables) {
    text += `, taulut: ${s.tables.join(", ")}`;
  }
  return text;
}
