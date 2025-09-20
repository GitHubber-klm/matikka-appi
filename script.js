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
    if (operation === "sub" && a < b) {
      [a, b] = [b, a];
    }
  }

  let opSymbol = {
    "add": "+",
    "sub": "−",
    "mul": "×"
  }[operation];

  document.getElementById("question").textContent = `${a} ${opSymbol} ${b} = ?`;
  document.getElementById("answer").value = "";
  document.getElementById("feedback").textContent = "";
  document.getElementById("feedback").className = "";
  document.getElementById("answer").focus();

  currentQuestion++;
}

function checkAnswer() {
  const input = document.getElementById("answer");
  const userAnswer = parseInt(input.value);

  let correct = 0;

  if (operation === "add") correct = a + b;
  else if (operation === "sub") correct = a - b;
  else if (operation === "mul") correct = a * b;

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

  const summary = document.getElementById("summaryText");
  summary.textContent = `Sait ${correctAnswers}/10 oikein! 🥳`;
}

function goToStart() {
  document.querySelector(".setup").classList.remove("hidden");
  document.querySelector(".summary").classList.add("hidden");
  document.querySelector(".game").classList.add("hidden");
}


function toggleAllTables() {
  const checkboxes = document.querySelectorAll("#multiplicationOptions input[type='checkbox']");
  const allChecked = Array.from(checkboxes).every(cb => cb.checked);
  checkboxes.forEach(cb => cb.checked = !allChecked);

  document.getElementById("toggleAllTables").textContent = allChecked
    ? "Valitse kaikki"
    : "Poista kaikki";
}


// ⌨️ Enter = Tarkista
document.addEventListener("DOMContentLoaded", () => {
  const answerInput = document.getElementById("answer");
  answerInput.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      checkAnswer();
    }
  });



  // Näytä kertotaulun valinta vain jos × on valittu
  const opSelect = document.getElementById("operationSelect");
  // Tyhjennä kertotaulut aluksi
  document.querySelectorAll("#multiplicationOptions input[type='checkbox']")
  .forEach(cb => cb.checked = false);

  opSelect.addEventListener("change", () => {
    const show = opSelect.value === "mul";
    document.getElementById("multiplicationOptions").classList.toggle("hidden", !show);
  });
});


