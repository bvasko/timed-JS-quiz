/**
 * Setup App Structure
 * 
 */
const ScoreBoard = function ScoreBoard() {
    /*
    * ScoreBoard
    * - render list of scores and initials
    * - sort scores array from highest to lowest
    * - display "clear high scores" button
    * - display "go back" button to return to Quiz home page
    */
}
const Quiz = function Quiz() {
  return {
      quizData: data(), //load data from global namespace - ugh
      msgCorrect: "Good job!",
      msgIncorrect: "Nope",
      questionIndex: null,
      score: null,
      timerSeconds: null,
      handleAnswerClick: function(question, evt) {
        /* Create custom event for answer click */
        const li = evt.target;
        const clickAnswer = new Event("clickAnswer", {
          "bubbles":false, 
          "cancelable":false,
          answer: li.textContent, 
          question: question});
        li.dispatchEvent(clickAnswer);
 
        const answer = evt.target.textContent;

        /*
        * Try to decouple these things by adding listeners for the custom event
          * - updates score
          * - updates timer if the answer is wrong
          * - displays message to the user if the answer is correct or wrong
          * - advances to the next question 
        * **/

        if (answer === question.correctAnswer) {
          //increment score & show correct message
          this.score = this.score + 10;
          this.showAnswerMessage(this.msgCorrect, true);
        } else {
          // decrement timer & show incorrect message
          this.timerSeconds = this.timerSeconds - 10;
          this.showAnswerMessage(this.msgIncorrect, false);
        }
        // next question
        this.questionIndex++; 
        /* use setTimer to wait before displaying next question */
        //this.renderQuestion();
      },
      renderQuestion: function(q) {
        /*
          * Display question & answers
        */
        const _question = this.quizData.questions[this.questionIndex];
        let questionEl = document.getElementById("question");
        let answersEl = document.getElementById("answers");
        let olEl = document.createElement("ol");
        olEl.id = "answerList";
        questionEl.innerHTML = `<p>${_question.question}</p>`;
        _question.answers.forEach((answer) => {
          let liEl = document.createElement("li");
          liEl.textContent += answer;
          olEl.append(liEl);
        });
        olEl.addEventListener("click", this.handleAnswerClick.bind(this, _question));
        answersEl.append(olEl);
      },
      showAnswerMessage: function(msg, isCorrect) {
        let msgEl = document.getElementById("msg");
        let className = (isCorrect) ? "correct" : "wrong";
        msgEl.innerHTML = `<p class="${className}">${msg}</p>`;
      },
      startTimer: function() {
        const timerInterval = setInterval(function(){ 
          this.timerSeconds--;
          if (this.timerSeconds === 0) {
            clearInterval(timerInterval);
          }
        }, 1000);
      },
      startQuiz: function() {
        /*
        * - initializes countdown timer
        * - initializes score
        * - initializes question index to store which question user is on
        * - displays first question & answers
        * - starts countdown timer
        */
        this.score = 0;
        this.questionIndex = 0;
        this.timerSeconds = 180;
        /* hide intro screen */
        const startScreen = document.getElementById("startScreen");
        startScreen.style.display = 'none';
        this.renderQuestion();
        this.startTimer();
      },
      finishQuiz: function() {
        /* 
        * - show final score
        * - show input for initials
        * - show submit button
        * - validate input text
        * - store object or array in localStorage of user initials & score
        * - sort scores array from highest to lowest
        */
      }
  }
};

/**
 * Loading the quiz initializes the first screen where user presses 'start quiz'
 * attach listener to 'start quiz' btn and run startQuiz function
 */
function initApp() {
  const newTest = Quiz();
  const startBtn = document.getElementById("startQuiz");
  document.addEventListener("clickAnswer", function(evt){
    console.log('my custom event', evt)
  });
  startBtn.addEventListener("click", function(evt){
    console.log('start', newTest)
    newTest.startQuiz();
  });
}

initApp();