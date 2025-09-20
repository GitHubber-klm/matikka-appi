let operation = "add";
let max = 10;
let a = 0;
let b = 0;
let currentQuestion = 0;
let correctAnswers = 0;

function startGame() {
  operation = document.getElementById("operationSelect").value;
  max = parseInt(document.getElementById("maxNumber").value);
  currentQuestion = 0;
  correctAnswers = 0;

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

  currentQuestion++;
}

function checkAnswer() {
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
    feedback.textContent = "👍 Oikein!";
    feedback.className = "correct";
    correctAnswers++;
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
  summary.textContent = `${avatar} ${name}, sait ${correctAnswers}/10 oikein! 🎉`;

  // Paras tulos
  const best = parseInt(localStorage.getItem("bestScore") || "0");
  if (correctAnswers > best) {
    localStorage.setItem("bestScore", correctAnswers);
    document.getElementById("highScoreText").textContent = "🎉 Uusi ennätys!";
  } else {
    document.getElementById("highScoreText").textContent = `Paras tulos: ${best}/10`;
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
  const score = correctAnswers;
  const shareText = `${name} sai ${score}/10 oikein matikkapelissä! Kokeile sinäkin!`;

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
