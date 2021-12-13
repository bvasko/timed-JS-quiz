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

/**
 * 
 * Quiz doesn't end when time runs out
 */

const ScoreBoard = function ScoreBoard() {
    /*
    * ScoreBoard
    * - render list of scores and initials
    * - display "clear high scores" button
    * - display "go back" button to return to Quiz home page on click
    */
    return {
      showScoreboard: function() {
        const boardUI = document.getElementById("scoreboard");
        const startScreen = document.getElementById("startScreen");
        const goBack = document.getElementById("homeBtn");
        document.getElementById("showScoreboardBtn").style.display = "none";
        document.getElementById("finalScreen").style.display = "none";
        goBack.addEventListener("click", function() {
          this.goBack();
        }.bind(this));
        boardUI.style.display = "block";
        startScreen.style.display = "none";
        this.renderScores();
      },
      clearScores: function() {
        localStorage.clear();
        document.getElementById("highScores").innerHTML = "";
      },
      goBack: function() {
        document.getElementById("scoreboard").style.display = "none";
        document.getElementById("startScreen").style.display = "block";
        document.getElementById("showScoreboardBtn").style.display = "block";
        document.getElementById("showScoreboardBtn").style.visibility = "visible";
      },
      getScores: function() {
        return JSON.parse(localStorage.getItem("scores"));
      },
      renderScores: function() {
        const scores = this.getScores();
        if (!scores) return;
        const scoresEl = document.getElementById("highScores");
        scoresEl.innerHTML = "";
        const scoreListEl = document.createElement("ol");
        scores.forEach((scoreObj) => {
          const {initials, score, ts} = scoreObj;
          scoreListEl.innerHTML += `<li>${initials} ${score} ${ts}</li>`;
        });
        scoresEl.append(scoreListEl);
      }
    }
}
const Quiz = function Quiz() {
  return {
      attempts: 0,
      quizData: data(), //load data from global namespace - ugh
      msgCorrect: "Good job!",
      msgIncorrect: "Nope",
      questionIndex: null,
      score: null,
      timerSeconds: 10,
      handleAnswerClick: function(evt) {
        /* 
        * Dispatch custom events on answer click to display response
        * and deduct time penalty
        **/
        const question = this.quizData.questions[this.questionIndex];
        const answer = evt.target.textContent;
        const correctAnswer = (answer === question.correctAnswer);
        if (this.attempts === 0 && correctAnswer) {
          this.score = this.score + 20;
        }
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
          // track answer attempts so the score only increments when you get it right on the first try
          this.attempts++;
          // send event to deduct time penalty
          const penalty = new Event(events.TIME_PENALTY);
          document.dispatchEvent(penalty);
        } 
      },
      renderQuestion: function() {
        /* Display question & answers */
        this.attempts = 0;
        let olEl = null;
        if (document.getElementById("answerList")) {
          olEl = document.getElementById("answerList")
        } else {
          olEl = document.createElement("ol");
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
            if (this.questionIndex === this.quizData.questions.length){
              this.finishQuiz();
              return;
            }
            this.renderQuestion(); 
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
      validateInput: function(val) {
        return (val.length !==0) ? String(val) : false;
      },
      saveScore: function(evt) {
        let lsScores = JSON.parse(localStorage.getItem('scores')) || [];
        const inputVal = document.getElementById("name");
        const isValid = this.validateInput(inputVal.value);
        if (!isValid) {
          document.getElementById("saveError").textContent = "Please enter your initials to proceed";
          return;
        }
        const d = new Date();
        const scoreObj = {
          initials: inputVal.value,
          score: this.score,
          ts: d.toDateString()
        };
        lsScores.push(scoreObj);
        localStorage.setItem('scores', JSON.stringify(lsScores));
        App.ScoreboardView.showScoreboard();
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
          if (this.timerSeconds === 0 || this.timerSeconds < 0) {
            timerEl.textContent = this.formatTime(this.timerSeconds);
            this.finishQuiz();
            clearInterval(timerInterval);
          }
          this.timerSeconds--;
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
        /* Remove error class after 800ms */
        const t = setTimeout(() => {
          timerEl.setAttribute("class", "");
        }, 800)
      },
      resetQuiz: function() {
        this.score = 0;
        this.questionIndex = 0;
        this.timerSeconds = 180;
        this.attempts = 0;
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
        
        this.resetQuiz();
        const timerEl = document.getElementById("quizTimer");
        const quizEl = document.getElementById("quiz");
        document.getElementById("showScoreboardBtn").style.visibility = "hidden";
        quizEl.style.display = "block";
        const startScreen = document.getElementById("startScreen");
        startScreen.style.display = 'none';
        timerEl.style.display = 'block';
        // show first question and start timer
        this.startTimer();
        this.renderQuestion();
      },
      finishQuiz: function() {
        /* 
        * - show final score
        * - show input for initials
        * - show submit button
        * - validate input text
        * - store object or array in localStorage of user initials & score
        */
        let finalScreen = document.getElementById("finalScreen");
        finalScreen.style.display = "block";
        let quiz = document.getElementById("quiz");
        document.getElementById("question").innerHTML = "";
        document.getElementById("answers").innerHTML = "";
        quiz.style.display = "none";
        const finalScore = document.getElementById("finalScore");
        finalScore.innerHTML = `Your final score is ${this.score}`;
        this.timerSeconds = 0;
        this.startTimer(true); //pass stopTimer arg bool to stopTimer
      }
  }
};

/**
 * Loading the quiz initializes the first screen where user presses 'start quiz'
 * attach listeners here so they only attach and fire once
 */
let App = {
    /**
   * Instantiate Scoreboard and attach listener to show scoreboard
   */
  ScoreboardView: ScoreBoard(),
  scoreboardBtn: document.getElementById("showScoreboardBtn"),
  clearScoresBtn: document.getElementById("clearScores"),
  newTest: Quiz(),
  startBtn: document.getElementById("startQuiz"),
  initApp: function() {
    /**
     * Instantiate quiz and attach listener to start quiz
     */
    this.startBtn.addEventListener("click", function(evt){
      this.newTest.startQuiz();
    }.bind(this));
    this.scoreboardBtn.addEventListener("click", function() {
      this.ScoreboardView.showScoreboard();
    }.bind(this));
    this.clearScoresBtn.addEventListener("click", function() {
      this.ScoreboardView.clearScores();
    }.bind(this));
    const saveBtn = document.getElementById("submitBtn");
    saveBtn.addEventListener("click", this.newTest.saveScore.bind(this.newTest));
    const quizEl = document.getElementById("quiz");
    quizEl.addEventListener("click", this.newTest.handleAnswerClick.bind(this.newTest));
    // attach the custom event listeners
    document.addEventListener(events.DISPLAY_RESPONSE, this.newTest.showAnswerMessage.bind(this.newTest));
    document.addEventListener(events.TIME_PENALTY, this.newTest.timePenalty.bind(this.newTest));
  }
}

App.initApp();