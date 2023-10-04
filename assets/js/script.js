
var questionArea = document.querySelector(".question-area");
var buttonArea = document.querySelector(".button-area");
var timerArea = document.querySelector(".timer");

var startButton = document.querySelector(".start");
var correctButton = document.querySelector(".correct")
var wrongButton = document.querySelector(".wrong")

var questionCurrent = 0;
var pickedQ;
var secondsLeft = 121;

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
    timerArea.textContent = `${secondsLeft} remaining...`;

    if(secondsLeft === 0) {
      clearInterval(timerInterval);
      timerArea.textContent = `Time's up!`;
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

  divQuestion.textContent = pickedQ.question
  questionArea.appendChild(divQuestion);
  
  for(x=0; x < pickedQ.answers.length; x++) {
    buttonMaker(pickedQ.answers[x], x);
  }
}

function buttonMaker(answer, number) {
  var divButton = document.createElement("BUTTON");
  divButton.textContent = answer;
  buttonArea.appendChild(divButton);
    
  if(number === pickedQ.correct){
    divButton.setAttribute("class", "correct")
  }else {
    divButton.setAttribute("class", "wrong")
  }
}

function questionHide() {
  divQuestion.setAttribute("class", "invisible");
  divButton.setAttribute("class", "invisible");
}

function questionNext() {
  if(questionCurrent > 2) {
    quizEnd();
  } else {
    questionHide();
    questionPicker();
  }
}

function quizEnd() {
  //tbd
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

correctButton.addEventListener("click", function() {
  questionNext();
})

wrongButton.addEventListener("click", function() {
  secondsLeft = secondsLeft - 30;
  questionNext();
})

init();




// append button to divTag
// flag the correct button
// maybe add an eventListener on quiz element and see if event target matches one of the answer buttons

/*
  When an answer button is clicked:
    - Was the right one clicked?
      - If not, display message and steal time
      - If yes, display message
    - Change the question counter (++)
  Call function again (move to next question)


*/