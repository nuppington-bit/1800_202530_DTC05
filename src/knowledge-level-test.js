const question = [
  {
    question: "What is the strongest type of password?",
    answer: [
      { text: "A common word like potato", correct: false },
      { text: "Your pet's name and your birth year ", correct: false },
      { text: "A long, random mix of letters (upper and lower case), numbers, and symbols", correct: true},
      { text: "something", correct: false },
    ],
  },
  {
    question:"What should you do if a website you don't trust asks for your personal information like your home address or phone number?",
    answer: [
      { text: "something", correct: false },
      { text: "something", correct: false },
      { text: "something", correct: false },
      { text: "something", correct: false },
    ],
  },
  {
    question: something,
    answer: [
      { text: "something", correct: false },
      { text: "something", correct: false },
      { text: "something", correct: false },
      { text: "something", correct: false },
    ],
  },
  {
    question: something,
    answer: [
      { text: "something", correct: false },
      { text: "something", correct: false },
      { text: "something", correct: false },
      { text: "something", correct: false },
    ],
  },
  {
    question: something,
    answer: [
      { text: "something", correct: false },
      { text: "something", correct: false },
      { text: "something", correct: false },
      { text: "something", correct: false },
    ],
  },
  {
    question: something,
    answer: [
      { text: "something", correct: false },
      { text: "something", correct: false },
      { text: "something", correct: false },
      { text: "something", correct: false },
    ],
  },
  {
    question: something,
    answer: [
      { text: "something", correct: false },
      { text: "something", correct: false },
      { text: "something", correct: false },
      { text: "something", correct: false },
    ],
  },
  {
    question: something,
    answer: [
      { text: "something", correct: false },
      { text: "something", correct: false },
      { text: "something", correct: false },
      { text: "something", correct: false },
    ],
  },
  {
    question: something,
    answer: [
      { text: "something", correct: false },
      { text: "something", correct: false },
      { text: "something", correct: false },
      { text: "something", correct: false },
    ],
  },
  {
    question: something,
    answer: [
      { text: "something", correct: false },
      { text: "something", correct: false },
      { text: "something", correct: false },
      { text: "something", correct: false },
    ],
  },
];

const questionElement = document.getElementById("question");
const answerButton = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-button")

let currentQuestionindex = 0;
let score = 0;

function startQuiz(){
  currentQuestionindex = 0; 
  score = 0;
  nextButton.innerHTML = "Next";
  showQuestion();
}

function showQuestion(){
  resetState();
  let currentQuestion = question[currentQuestionindex];
  let questionNo = currentQuestionindex + 1;
  questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

  currentQuestion.answer.forEach(answer => {
    const button = document.createElement("button");
    button.innerHTML = answer.text;
    button.classList.add("btn");
    answerButton.appendChild(button);
    if(answer.correct){
      button.dataset.correct = answer.correct 
    }
    button.addEventListener("click", selectAnswer);
  });
}

function resetState(){
  nextButton.style.display = "none";
  while(answerButton.firstChild){
    answerButton.removeChild(answerButtons.firstChild);
  }
}
function selectAnswer(e){
  const selectedBtn = e.target;
  const isCorrect = selectedBtn.dataset.correct === "true";
  if(isCorrect){
    selectedBtn.classList.add("correct");
    score++
  }else{
    selectedBtn.classList.add("incorrect");
  }
  Array.from(answerButton.children).forEach(button =>{
    if(button.dataset.correct === "true"){
      button.classList.add("correct");
    }
    button.disabled = true;
  });
  nextButton.style.display = "block"
}

function showScore(){
  resetState();
  questionElement.innerHTml = `You scored ${score} our of $[questions.length]!`;
  nextButton.innerHTML = "Play Again";
  nextButton.style.display = "block";
}

function handleNextButton(){
  currentQuestionindex++
  if(currentQuestionindex < question.length){
    showQuestion();
  }else{
    showScore();
  }
}

nextButton.addEventListener("click", ()=>{
  if(currentQuestionindex < question.length){
    handleNextButton();
  }else{
    startQuiz();
  }
});

startQuiz();