import { auth, db } from "/src/firebaseConfig.js";
import { doc, collection, onSnapshot, getDoc, updateDoc, addDoc } from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { onAuthReady } from "./authentication.js";

const question = [
  {
    question: "What is the strongest type of password?",
    answer: [
      { text: "A common word like potato", correct: false },
      { text: "Your pet's name and your birth year ", correct: false },
      {
        text: "A long, random mix of letters (upper and lower case), numbers, and symbols",
        correct: true,
      },
      { text: "something", correct: false },
    ],
  },
  {
    question:
      "What should you do if a website you don't trust asks for your personal information like your home address or phone number?",
    answer: [
      {
        text: "Provide the information so you can access the website.",
        correct: false,
      },
      {
        text: "Close the website and not provide the information.",
        correct: true,
      },
      { text: "Make up fake information and enter it", correct: false },
      { text: "Ask a friend what you should do", correct: false },
    ],
  },
  {
    question:
      'You get an email that says "Your account will be closed! Click here to verify your identity!" What is the most likely threat?',
    answer: [
      { text: "A software update", correct: false },
      { text: "A phishing scam", correct: true },
      { text: "A helpful reminder from a company", correct: false },
      { text: "A new social media trend", correct: false },
    ],
  },
  {
    question:
      "Why is Two-Factor Authentication (2FA) an important security feature?",
    answer: [
      {
        text: "It makes your password shorter and easier to remember.",

        correct: false,
      },
      {
        text: "It prevents websites from tracking your activity.",
        correct: false,
      },
      {
        text: "It adds a second layer of security, requiring both your password and a temporary code to log in.",
        correct: true,
      },
      {
        text: "It automatically updates all your software for you.",
        correct: false,
      },
    ],
  },
  {
    question:
      "What is the primary risk of using an unsecured public Wi-Fi network (like at a coffee shop) without protection?",
    answer: [
      { text: "It will make your battery drain faster.", correct: false },
      {
        text: "Someone else on the network can potentially see the data you are sending and receiving.",
        correct: true,
      },
      { text: "It will automatically share your photos.", correct: false },
      { text: "It will change your computer's settings.", correct: false },
    ],
  },
  {
    question:
      "What is a key difference between HTTP and HTTPS in a website's address bar?",
    answer: [
      { text: "HTTPS websites load faster.", correct: false },
      {
        text: "HTTPS indicates the connection between your browser and the website is encrypted and more secure.",
        correct: true,
      },
      {
        text: "HTTP is for mobile sites, and HTTPS is for desktop sites.",
        correct: false,
      },
      {
        text: "HTTPS means the website's content is always accurate and true.",
        correct: false,
      },
    ],
  },
  {
    question: 'What is a "zero-day" vulnerability',
    answer: [
      {
        text: "A virus that only activates on a specific date.",
        correct: false,
      },
      {
        text: "A security flaw in software that is unknown to the vendor and has no available patch.",
        correct: true,
      },
      {
        text: "A type of phishing attack that happens at midnight.",
        correct: false,
      },
      { text: "A setting that resets your privacy controls.", correct: false },
    ],
  },
  {
    question: 'In the context of a data breach, what is "data exfiltration"?',
    answer: [
      { text: "The process of encrypting data to protect it.", correct: false },
      {
        text: "The process of securely deleting data",
        correct: false,
      },
      {
        text: "The public announcement that a breach has occurred.",
        correct: false,
      },
      {
        text: "The unauthorized transfer of data from a target's network to an attacker's system.",
        correct: true,
      },
    ],
  },
  {
    question: "What is the core security principle behind a Password Manager?",
    answer: [
      {
        text: "To use a single, very complex master password to protect all other unique, complex passwords for different sites.",
        correct: true,
      },
      {
        text: "To automatically share your passwords across all your devices for convenience.",
        correct: false,
      },
      {
        text: "To create easy-to-remember passwords for every website.",
        correct: false,
      },
      {
        text: "To notify companies when your password has been stolen.",
        correct: false,
      },
    ],
  },
];

const questionElement = document.getElementById("question");
const answerButton = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-button");
const confirmButton = document.getElementById("confirm-button");
const homeButton = document.getElementById("home-button")

let currentQuestionindex = 0;
let score = 0;
let selectedBtn = null;

function startQuiz() {
  currentQuestionindex = 0;
  score = 0;
  nextButton.innerHTML = "Next";
  confirmButton.innerHTML = "Confirm";
  showQuestion();
}

async function addTestScore(score) {
  console.log(score)
  const auth = getAuth();
  const user = auth.currentUser;
  const testScoresRef = collection(db, "users", user.uid, "testScores")
  const testTimestamp = serverTimestamp()
  await addDoc(testScoresRef, { score: score, timestamp: testTimestamp });
}

async function saveKnowledgeLevel(level, score) {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      throw new Error("No user logged in");
    }

    const userRef = doc(db, "users", user.uid);

    // Update the document
    await updateDoc(userRef, {
      knowledgeLevel: level,
      testAverage: (score / 9) * 100,
      lastUpdated: new Date(),
    });
    addTestScore((score / 9) * 100)

    return user;
  } catch (error) {
    console.error("Full error:", error);
    throw error;
  }
}

function showQuestion() {
  resetState();
  let currentQuestion = question[currentQuestionindex];
  let questionNo = currentQuestionindex + 1;
  questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

  currentQuestion.answer.forEach((answer) => {
    const button = document.createElement("button");
    button.innerHTML = answer.text;
    button.classList.add("btn", "btn-quiz", "w-100", "mt-2", "py-3");
    answerButton.appendChild(button);
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener("click", () => {
      Array.prototype.forEach.call(document.getElementsByClassName("select"), element => {
        element.classList.remove("select")
      });
      button.classList.add("select")
      selectedBtn = button;
      confirmButton.style.display = "block"
    });
  });
}

function resetState() {
  homeButton.style.display = "none"
  nextButton.style.display = "none";
  confirmButton.style.display = "none";
  selectedBtn = null;

  while (answerButton.firstChild) {
    answerButton.removeChild(answerButton.firstChild);
  }
}

function confirmAnswer() {
  const isCorrect = selectedBtn.dataset.correct === "true";

  if (isCorrect) {
    selectedBtn.classList.add("correct",);
    selectedBtn.classList.remove("btn-quiz", "select")
    score++;
  } else {
    selectedBtn.classList.add("incorrect",);
    selectedBtn.classList.remove("btn-quiz", "select")
  }
  Array.from(answerButton.children).forEach((button) => {
    if (button.dataset.correct === "true") {
      button.classList.add("correct",);
      button.classList.remove("btn-quiz", "select")
    }
    button.disabled = true;
  });
  nextButton.style.display = "block";
  confirmButton.style.display = "none"
}

function showScore() {
  resetState();
  console.log(score);
  let levelString = "Beginner";
  let level = 0;
  if (score < 3) {
    levelString = "Beginner";
    level = 0;
  } else if (3 <= score && score < 6) {
    levelString = "Intermediate";
    level = 1;
  } else {
    levelString = "Expert";
    level = 2;
  }
  questionElement.innerHTML = `You scored ${score} out of ${question.length}! <br>
  Your recommended level is ${levelString}.`;
  saveKnowledgeLevel(level, score);
  nextButton.innerHTML = "Play Again";
  nextButton.style.display = "block";
  homeButton.style.display = "block";
}

function handleNextButton() {
  currentQuestionindex++;
  if (currentQuestionindex < question.length) {
    showQuestion();
  } else {
    showScore();
  }
}

nextButton.addEventListener("click", () => {
  if (currentQuestionindex < question.length) {
    handleNextButton();
  } else {
    startQuiz();
  }
});

confirmButton.addEventListener("click", () => {
  confirmAnswer()
})

startQuiz();