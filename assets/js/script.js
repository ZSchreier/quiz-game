
var questionArea = document.querySelector(".question-area");
var buttonArea = document.querySelector(".button-area");
var timerArea = document.querySelector(".timer-area");
var scoreArea = document.querySelector(".score-area");
var restartArea = document.querySelector(".restart-area");

var startButton = document.querySelector(".start");

var gameOver = false;
var questionCurrent = 0;
var pickedQ = null;
var secondsLeft = 121;

var newInitials = ""
var endScore = 0;
var highscore = [];

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
  if(pickedQ !== null){
    var oldQuestions = questionArea.querySelectorAll(".new");
    var oldWrongButtons = buttonArea.querySelectorAll(".wrong");
    var oldCorrectButtons = buttonArea.querySelectorAll(".correct");

    hideLoop(oldQuestions);
    hideLoop(oldWrongButtons);
    hideLoop(oldCorrectButtons);
  }
}

function hideScoreboard(){
  var scoreTitle = scoreArea.querySelectorAll("h2");
  var scoreText = scoreArea.querySelectorAll("textarea");
  var saveButton = scoreArea.querySelectorAll(".save-initials");
  var titleHide = scoreTitle[0]
  var textHide = scoreText[0]
  var buttonHide = saveButton[0]

  titleHide.setAttribute("class", "invisible");
  textHide.setAttribute("class", "invisible");
  buttonHide.setAttribute("class", "invisible");
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
  gameOver = true;
  scoreGrabber();
}

function scoreGrabber(){
  var scoreboardTitle = document.createElement("h2")
  var initialsHere = document.createElement("textarea");
  var scoreButton = document.createElement("button");
  scoreButton.setAttribute("class", "save-initials")
  endScore = secondsLeft;

  scoreboardTitle.textContent = `You finished with a score of ${endScore}! Enter your initials here to save it to the scoreboard!`;
  scoreButton.textContent = "Save Initials";

  scoreArea.appendChild(scoreboardTitle);
  scoreArea.appendChild(initialsHere);
  scoreArea.appendChild(scoreButton);
}

function renderScoreboard(){
  scoreboard = JSON.parse(localStorage.getItem('highscore'));
  for(x=0; x < scoreboard.length; x++){
    var scoreDisplay = document.createElement("h4");
    var scoreInitial = scoreboard[x]
    var scoreNumber = scoreboard[x]
    scoreDisplay.textContent = `${scoreInitial.initials} finished with a score of ${scoreNumber.score}!`;
    scoreArea.appendChild(scoreDisplay);
  }
  var restartButton = document.createElement("button");
  restartButton.textContent = "Play Again";
  restartButton.setAttribute("class", "restart")

  restartArea.appendChild(restartButton);
}

function saveChanges() {
  var sendCombined = {
    initials: newInitials,
    score: endScore
  }

  highscore.push(sendCombined)

  localStorage.setItem("highscore", JSON.stringify(highscore))

  hideScoreboard();
  renderScoreboard();
}


startButton.addEventListener("click", function(event){
  event.preventDefault();
  startButton.setAttribute("class", "invisible");
  timer();
  questionNext();
})

buttonArea.addEventListener("click", function(event) {
  event.preventDefault();
  if(event.target.matches("button.correct")){
    questionNext();
  }else if(event.target.matches("button.wrong")){
    secondsLeft = secondsLeft - 20;
    questionNext();
  }
})

scoreArea.addEventListener("click", function(event){
  event.preventDefault();
  if(event.target.matches(".save-initials")){
    var initialsFind = document.querySelector("textarea");
    var initialsValue = initialsFind.value.trim();
    if(initialsValue === ""){
      newInitials = "Anonymous";
    }else{
      newInitials = initialsValue;
    }
    saveChanges();
  }
})

restartArea.addEventListener("click", function(event){
  if(event.target.matches(".restart")){
    location.reload();
  }
})