
// Here are my query selector variables, used for eventListener targeting and dynamically adding the various elements needed
var questionArea = document.querySelector(".question-area");
var buttonArea = document.querySelector(".button-area");
var timerArea = document.querySelector(".timer-area");
var scoreArea = document.querySelector(".score-area");
var restartArea = document.querySelector(".restart-area");

var startButton = document.querySelector(".start");

// These are global variable that will be changed throughout the quiz that will affect the endgame state and local storage
var gameOver = false;
var questionCurrent = 0;
var pickedQ = null;
var secondsLeft = 121;

var newInitials = ""
var endScore = 0;

// Shoutout to TA Katy for helping with the usage of "||" to make sure I can properly load/read the local storage; didn't realize 'or' works outside of if statements and the like
var highscore = JSON.parse(localStorage.getItem('highscore')) || [];

// This array of objects is the bread and butter of the code, storing the questions, answers, and the position of the correct answer
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
  },
  {
    question: "What time do the tornado sirens get tested on the first Wednesday of the month in Minnesota?",
    answers: ["12:00 pm", "1:00 pm", "2:00 pm", "3:00 pm"],
    correct: 1
  }
]

// This controls the timer and when it should click off
function timer() {
  var timerInterval = setInterval(function() {
    secondsLeft--;
    timerArea.textContent = `${secondsLeft} seconds remaining...`;

    if(secondsLeft === 0) {
      clearInterval(timerInterval);
      timerArea.setAttribute("class", "invisible");
      questionHide();
      quizEnd();
    }else if(gameOver){
      clearInterval(timerInterval);
      timerArea.setAttribute("class", "invisible");
    }

  }, 1000);
}

// This function grabs the next(or first) question when called and adjusts a tracking variable
function questionPicker() {
  pickedQ = questionOption[questionCurrent]
  questionCurrent++;
  questionPresent();
}

// This function creates the question and calls another function to make the answer buttons
function questionPresent() {
  var divQuestion = document.createElement("div")
  
  divQuestion.textContent = pickedQ.question;
  divQuestion.setAttribute("class", "new");

  questionArea.appendChild(divQuestion);
  
  for(x=0; x < pickedQ.answers.length; x++) {
    buttonMaker(pickedQ.answers[x], x);
  }
}

// This is the aforementioned button-generating function
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

//This function hides the previous question (or question when time runs out). The "if" statement is there to make sure the first question has already been generated due to the timing of when it is called
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

// This function is called inside of the above function, and it loops through the selected elements and hides them
function hideLoop(htmlCollection){
  for(x=0; x < htmlCollection.length; x++){
    var htmlSpot = htmlCollection[x];
    htmlSpot.setAttribute("class", "invisible");
  }
}

//This function hides the input screen after finishing the quiz
function hideInputScore(){
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

//This function is the function responsible for moving the quiz to the next question, calling the appropriate functions and ending the game if necessary
function questionNext() {
  if(questionCurrent > 3) {
    questionHide();
    quizEnd();
  } else {
    questionHide();
    questionPicker();
  }
}

//This function sets a global variable to end the timer and sets off the scoreboard-generating process
function quizEnd() {
  gameOver = true;
  scoreGrabber();
}

//This function creates and displays the input field for saving your score
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

// This function renders the information saved in local storage to the webpage, as well as creating the "Play Again" and "Reset Scores" buttons
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
  restartButton.setAttribute("class", "restart");

  restartArea.appendChild(restartButton);

  var scoreboardReset = document.createElement("button");
  scoreboardReset.textContent = "Reset Scores";
  scoreboardReset.setAttribute("class", "score-reset");

  restartArea.appendChild(scoreboardReset);
}

// This function saves the new scores to the local storage before calling the functions that hide the input and renders the scoreboard
function saveChanges() {
  var sendCombined = {
    initials: newInitials,
    score: endScore
  }

  highscore.push(sendCombined)
  highscore.sort(function(x,y){
    if(x.score > y.score){
      return -1;
    }
  })
  localStorage.setItem("highscore", JSON.stringify(highscore))

  hideInputScore();
  renderScoreboard();
}

// This event listener starts the game off and hides the button
startButton.addEventListener("click", function(event){
  event.preventDefault();
  startButton.setAttribute("class", "invisible");
  timer();
  questionNext();
})

// This event listener checks whether an answer is right or wrong and moves the quiz to the next question (subtracting timer if necessary)
buttonArea.addEventListener("click", function(event) {
  event.preventDefault();
  if(event.target.matches("button.correct")){
    questionNext();
  }else if(event.target.matches("button.wrong")){
    secondsLeft = secondsLeft - 20;
    questionNext();
  }
})

// This event listener targets the button for saving your initials and score, with an if statement checking to make sure no empty strings get passed
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

// This event listener checks for the restart button AND the score reset button
restartArea.addEventListener("click", function(event){
  if(event.target.matches(".restart")){
    location.reload();
  }else if(event.target.matches(".score-reset")){
    localStorage.setItem("highscore", JSON.stringify([]));
    scoreArea.setAttribute("class", "invisible");
  }
})