
var questionArea = document.querySelector(".question-area");
var buttonArea = document.querySelector(".button-area");
var timerArea = document.querySelector(".timer");

var startButton = document.querySelector(".start");
// var button = document.querySelectorAll("button");

var gameOver = false;
var questionCurrent = 0;
var pickedQ = null;
var secondsLeft = 121;

var endScore;
var highscore;

var questionOption = [
  {
    question: "What is the airspeed velocity of an unladen swallow?",
    answers: ["30mph", "50mph", "African or European?", "I don't know"],
    correct: 2
  },
  {
    question: "What is the Minnesota state bird?",
    answers: ["Loon", "Turkey", "Finch", "I don't know"],
    correct: 0
  },
  {
    question: "What year is it?",
    answers: ["2023", "2022", "2024", "I don't know"],
    correct: 0
  }
]

function timer() {
  var timerInterval = setInterval(function() {
    secondsLeft--;
    timerArea.textContent = `${secondsLeft} seconds remaining...`;

    if(secondsLeft === 0) {
      clearInterval(timerInterval);
      timerArea.setAttribute("class", "invisible");
      quizEnd();
    }else if(gameOver){
      clearInterval(timerInterval);
      timerArea.setAttribute("class", "invisible");
    }

  }, 1000);
}

function questionPicker() {
  pickedQ = questionOption[questionCurrent]
  questionCurrent++;
  questionPresent();
}

function questionPresent() {
  var divQuestion = document.createElement("div")
  
  divQuestion.textContent = pickedQ.question;
  divQuestion.setAttribute("class", "new");

  questionArea.appendChild(divQuestion);
  
  for(x=0; x < pickedQ.answers.length; x++) {
    buttonMaker(pickedQ.answers[x], x);
  }
}

function buttonMaker(answer, number) {
  var divButton = document.createElement("button");
  divButton.textContent = answer;
  buttonArea.appendChild(divButton);
    
  if(number === pickedQ.correct){
    divButton.setAttribute("class", "correct");
  }else {
    divButton.setAttribute("class", "wrong");
  }
}

function questionHide() {
  if(pickedQ === null){
    alert(`You have 120 seconds, good luck!`);
  }else {
    var oldQuestions = questionArea.querySelectorAll(".new");
    var oldWrongButtons = buttonArea.querySelectorAll(".wrong");
    var oldCorrectButtons = buttonArea.querySelectorAll(".correct");

    hideLoop(oldQuestions);
    hideLoop(oldWrongButtons);
    hideLoop(oldCorrectButtons);
  }
}

function hideLoop(htmlCollection){
  for(x=0; x < htmlCollection.length; x++){
    var htmlSpot = htmlCollection[x];
    htmlSpot.setAttribute("class", "invisible");
  }
}

function questionNext() {
  if(questionCurrent > 2) {
    questionHide();
    quizEnd();
  } else {
    questionHide();
    questionPicker();
  }
}

function quizEnd() {
  alert(`This is the end for you my friend...`);
  gameOver = true;
}

function init() {
  highscore = JSON.parse(localStorage.getItem("highscore"))
}

function saveChanges() {
  localStorage.setItem("highscore", JSON.stringify(highscore))
}


startButton.addEventListener("click", function(){
  startButton.setAttribute("class", "invisible");
  timer();
  questionNext();
})

buttonArea.addEventListener("click", function(event) {
  if(event.target.matches("button.correct")){
    questionNext();
  }else if(event.target.matches("button.wrong")){
    secondsLeft = secondsLeft - 20;
    questionNext();
  }
})

// init();