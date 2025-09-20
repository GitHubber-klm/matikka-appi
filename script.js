let table = 2;
let currentQuestion = 0;
let correctAnswers = 0;
let num1 = 0;
let num2 = 0;

function startGame() {
  table = parseInt(document.getElementById("tableSelect").value);
  currentQuestion = 0;
  correctAnswers = 0;

  document.querySelector(".setup").classList.add("hidden");
  document.querySelector(".summary").classList.add("hidden");
  document.querySelector(".game").classList.remove("hidden");

  nextQuestion();
}

function nextQuestion() {
  if (currentQuestion >= 10) {
    showSummary();
    return;
  }

  num1 = table;
  num2 = Math.floor(Math.random() * 10) + 1;

  document.getElementById("question").textContent = `${num1} × ${num2} = ?`;
  document.getElementById("answer").value = "";
  document.getElementById("feedback").textContent = "";
  document.getElementById("feedback").className = "";
  document.getElementById("answer").focus();

  currentQuestion++;
}

function checkAnswer() {
  const userAnswer = parseInt(document.getElementById("answer").value);
  const correct = num1 * num2;
  const feedback = document.getElementById("feedback");

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

  const summary = document.getElementById("summaryText");
  summary.textContent = `Sait ${correctAnswers}/10 oikein! 🎉`;
}
