const questions = [
  {
    prompt: "Un paciente presenta debilidad del brazo y la pierna del lado izquierdo con pérdida del movimiento voluntario, sin lesión de la cara ni del sistema nervioso periférico. ¿Qué nivel anatómico sugiere este patrón?",
    options: [
      "Corteza motora primaria contralateral",
      "Nervio facial periférico",
      "Cerebelo ipsilateral",
      "Médula cervical anterior"
    ],
    correct: 0,
    explanation:
      "La debilidad contralateral del brazo y la pierna, sin compromiso de la cara, sugiere una lesión supratentorial cortical o subcortical en la vía piramidal, especialmente en la corteza motora primaria o áreas adyacentes."
  },
  {
    prompt: "Un paciente tiene pérdida de temperatura y dolor del hemicuerpo contralateral, pero conserva vibración y posición. ¿Qué vía está comprometida?",
    options: [
      "Vía espinotalámica lateral",
      "Lemnisco medial",
      "Tracto corticoespinal",
      "Vía vestibuloespinal"
    ],
    correct: 0,
    explanation:
      "La vía espinotalámica lateral transmite dolor y temperatura. Un patrón de disestesia termoalgésica contralateral apunta a una lesión en esta vía." 
  },
  {
    prompt: "Un paciente presenta ptosis, midriasis y eye movement limitado del ojo ipsilateral, con hemiparesia contralateral del cuerpo. ¿Cuál es la localización más probable?",
    options: [
      "Mesencéfalo",
      "Pons",
      "Bulbo",
      "Médula cervical"
    ],
    correct: 0,
    explanation:
      "La combinación de afectación de pares craneales ipsilaterales y hemiparesia contralateral sugiere una lesión del tronco encefálico, classically del mesencéfalo o puente, según el síndrome de Weber o Millard-Gubler."
  },
  {
    prompt: "Un paciente con afasia expresiva presenta dificultad para producir lenguaje oral, pero entiende órdenes simples. ¿Qué área está probablemente comprometida?",
    options: [
      "Área de Wernicke",
      "Área de Broca",
      "Cuerpo calloso",
      "Tálamo ventral anterior"
    ],
    correct: 1,
    explanation:
      "La afasia expresiva o no fluida se relaciona con lesión del área de Broca en el hemisferio dominante, con dificultad para producir palabras y lenguaje espontáneo."
  },
  {
    prompt: "Un paciente presenta temblor intencional y coordinación alterada con pierna ipsilateral. ¿Qué estructura está alterada?",
    options: [
      "Cerebelo",
      "Globo pálido",
      "Hipocampo",
      "Tálamo lateral"
    ],
    correct: 0,
    explanation:
      "El temblor intencional y la ataxia ipsilateral son clásicos de lesión cerebelosa, que afecta la coordinación y la precisión del movimiento." 
  }
];

const quiz = document.querySelector("#quiz");
const scoreNode = document.querySelector("#score");

let score = 0;
let answered = 0;

function renderQuiz() {
  quiz.innerHTML = "";

  questions.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "quiz-card";

    const questionTop = document.createElement("div");
    questionTop.className = "question-top";
    questionTop.innerHTML = `<span>Pregunta ${index + 1}</span>`;

    const prompt = document.createElement("h3");
    prompt.textContent = item.prompt;

    const answerList = document.createElement("div");
    answerList.className = "answer-list";

    item.options.forEach((option, optionIndex) => {
      const button = document.createElement("button");
      button.className = "answer-btn";
      button.type = "button";
      button.textContent = option;

      button.addEventListener("click", () => {
        if (button.disabled) return;

        const buttons = answerList.querySelectorAll("button");
        buttons.forEach((btn) => {
          btn.disabled = true;
        });

        const isCorrect = optionIndex === item.correct;
        if (isCorrect) {
          score += 1;
          button.classList.add("correct");
        } else {
          button.classList.add("incorrect");
          const correctButton = buttons[item.correct];
          correctButton.classList.add("correct");
        }

        answered += 1;
        scoreNode.textContent = `${score}/${questions.length}`;

        const feedback = document.createElement("div");
        feedback.className = "feedback";
        feedback.innerHTML = `
          <strong>${isCorrect ? "Correcto" : "No es la mejor opción"}.</strong>
          ${item.explanation}
        `;
        card.appendChild(feedback);
      });

      answerList.appendChild(button);
    });

    card.appendChild(questionTop);
    card.appendChild(prompt);
    card.appendChild(answerList);
    quiz.appendChild(card);
  });

  scoreNode.textContent = `${score}/${questions.length}`;
}

renderQuiz();

if (answered === 0) {
  scoreNode.textContent = `0/${questions.length}`;
}
