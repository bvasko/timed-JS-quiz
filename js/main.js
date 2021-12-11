/**
 * Setup App Structure
 * 
 */


const Quiz = function Quiz() {
  return {
      qData: data(),
      msgCorrect: "",
      msgIncorrect: "",
      questionIndex: null,
      score: null,
      timerSeconds: 180,
      checkAnswer: function(q, answer) {
        if (answer === q.correctAnswer) {
          //show correct message
          this.score = this.score + 10;
          showAnswerMessage(this.msgCorrect);
        } else {
          showAnswerMessage(this.msgIncorrect);
          this.timerSeconds = this.timerSeconds - 10;
        }
        this.questionIndex++;
        this.showNext();
      },
      renderQuestion: (q) => {
        console.log('display Question');
      },
      showAnswerMessage: () => {

      },
      showNext: () => {

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
        * startQuiz()
        * - initializes countdown timer
        * - nice to have: shows progress bar
        * - initializes score
        * - initializes question counter to store which question user is on
        * - loads first question & answers
        * - starts countdown timer
        */
        renderQuestion();
        score = 0;
        _startTimer();
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
  startBtn.addEventListener("click");
  newTest.startQuiz();
}

/*
 * renderQuestion()
 * - display question, answers and answer button
 * 
 * answer button click --
 *  then checkAnswer()
 * - updates score
 * - updates timer if the answer is wrong
 * - displays message to the user if the answer is correct or wrong
 * - advances to the next question
 * 
 * finishQuiz()
 * - show final score
 * - show input for initials
 * - show submit button
 * - validate input text
 * - store object or array in localStorage of user initials & score
 * - sort scores array from highest to lowest
 * 
 * ScoreBoard
 * - render list of scores and initials
 * - sort scores array from highest to lowest
 * - display "clear high scores" button
 * - display "go back" button to return to Quiz home page
 * 
 */