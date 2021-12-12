/**
 * Setup App Structure
 * 
 */
/***
 * Custom Event Dictionary
 */
 const events = {
  DISPLAY_RESPONSE: "displayResponse",
  TIME_PENALTY: "timePenalty",
  NEXT_QUESTION: "nextQuestion"
}

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
      handleAnswerClick: function(evt) {
        /* 
        * Dispatch custom events on answer click to display response
        * and deduct time penalty
        **/
        const question = this.quizData.questions[this.questionIndex];
        const answer = evt.target.textContent;
        const correctAnswer = (answer === question.correctAnswer);
        //create event to update response message
        const message = new CustomEvent(events.DISPLAY_RESPONSE, {
          detail: {
            correctAnswer: (correctAnswer),
            message: (correctAnswer) ? this.msgCorrect : this.msgIncorrect
          }
        });
        // dispatch time penalty event if the answer is wrong
        document.dispatchEvent(message);
        if (!correctAnswer) {
          // send event to deduct time penalty
          const penalty = new Event(events.TIME_PENALTY);
          document.dispatchEvent(penalty);
        } 
      },
      renderQuestion: function(q) {
        /* Display question & answers */
        if (this.questionIndex === this.quizData.questions.length -1) {
          return;
        }
        // TODO: clean up these conditionals
        let olEl = (document.getElementById("answerList")) ? 
          document.getElementById("answerList") : 
          document.createElement("ol");
        if (this.questionIndex === 0) {
          olEl.id = "answerList";
        }
        if (this.questionIndex !== 0) {
          document.getElementById("answerList").innerHTML = "";
          document.getElementById("msg").innerHTML = "";
        }
        const _question = this.quizData.questions[this.questionIndex];
        let questionEl = document.getElementById("question");
        let answersEl = document.getElementById("answers");

        questionEl.innerHTML = `<p class="question">
          <span class="question-number">
            ${this.questionIndex+1}
          </span> 
          ${_question.question}:
          </p>`;
        _question.answers.forEach((answer) => {
          let liEl = document.createElement("li");
          liEl.textContent += answer;
          liEl.className = "answer";
          olEl.append(liEl);
        });
        answersEl.append(olEl);
      },
      showAnswerMessage: function(evt) {
        /* 
        * TODO: re-enable CustomEvent here
          const next = new CustomEvent(events.NEXT_QUESTION, {detail: {}});
        **/
        let msgEl = document.getElementById("msg");
        let className = (evt.detail.correctAnswer) ? "correct" : "wrong";
        msgEl.innerHTML = `<p class="${className}">${evt.detail.message}</p>`;
        if (evt.detail.correctAnswer) {
          this.questionIndex++;
          const t = setTimeout(() => {
            if (this.questionIndex === this.quizData.questions.length-1){
              this.finishQuiz();
            }
            this.renderQuestion(this.quizData.questions[this.questionIndex]); 
          }, 1000);
        }
      },
      formatTime: function(time) {
        const minutes = Math.floor(time / 60);
        let seconds = time - (minutes*60);
        if (seconds < 10) {
          seconds = `0${seconds}`;
        }
        let timeStr = '';
        if (time === 0 || time < 0) {
          timeStr = "Time's up";
        } else {
          timeStr = `${minutes}:${(seconds === 0 ? "00" : seconds)}`;
        }
        return timeStr;
      },
      startTimer: function(stopTimer) {
        /**
         * Get DOM element for timer and display formatted time remaining
         * Begin timer countdown and update timer display until time runs out
         * Accept arg to clear timer if the user finishes the quiz
         */
        const timerEl = document.getElementById("quizTimer");
        timerEl.textContent = this.formatTime(this.timerSeconds);
        const timerInterval = setInterval(function(){ 
          timerEl.textContent = this.formatTime(this.timerSeconds);
          this.timerSeconds--;
          if (this.timerSeconds === 0 || this.timerSeconds < 0) {
            timerEl.textContent = this.formatTime(this.timerSeconds);
            clearInterval(timerInterval);
          }
        }.bind(this), 1000);
        if (stopTimer) {
          clearInterval(timerInterval);
          timerEl.style.display = "none";
        }
      },
      timePenalty: function() {
        this.timerSeconds = this.timerSeconds - 10;
        const timerEl = document.getElementById("quizTimer");
        timerEl.setAttribute("class","error");
        const t = setTimeout(() => {
          timerEl.setAttribute("class", "");
        }, 800)
      },
      startQuiz: function() {
        /*
        * - initializes countdown timer
        * - initializes score
        * - initializes question index to store which question user is on
        * - displays first question & answers
        * - starts countdown timer
        * - attach listeners
        */
       
        this.score = 0;
        this.questionIndex = 0;
        this.timerSeconds = 180;
        const timerEl = document.getElementById("quizTimer");
        const quizEl = document.getElementById("quiz");
        // attach the custom event listeners
        document.addEventListener(events.DISPLAY_RESPONSE, this.showAnswerMessage.bind(this));
        document.addEventListener(events.TIME_PENALTY, this.timePenalty.bind(this));
        quizEl.addEventListener("click", this.handleAnswerClick.bind(this));
        //TODO: make this work - need to change 'quizEl' to document
        //quizEl.addEventListener(events.NEXT_QUESTION, function(){ console.log("got it")});
        /* hide intro screen */
        const startScreen = document.getElementById("startScreen");
        startScreen.style.display = 'none';
        timerEl.style.display = 'block';
        // show first question and start timer
        this.startTimer();
        this.renderQuestion(this.quizData.questions[0]);
      },
      finishQuiz: function() {
        let quiz = document.getElementById("quiz");
        document.getElementById("question").innerHTML = "";
        document.getElementById("answers").innerHTML = "";
        quiz.style.display = "none";
        const finalEl = document.getElementById("finalScreen");
        finalEl.innerHTML = `Final Score: ${this.score}`;
        this.timerSeconds = 0;
        this.startTimer(true); //pass stopTimer arg bool to stopTimer
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
  startBtn.addEventListener("click", function(evt){
    newTest.startQuiz();
  });
}

initApp();