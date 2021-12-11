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
      handleAnswerClick: function(question, evt) {
        /* Dispatch custom event on answer click */
        const answer = evt.target.textContent;
        const correctAnswer = (answer === question.correctAnswer);
        //create event to update response message
        const message = new CustomEvent(events.DISPLAY_RESPONSE, {
          detail: {
            correctAnswer: (correctAnswer),
            message: (correctAnswer) ? this.msgCorrect : this.msgIncorrect
          }
        });
        // send event
        document.dispatchEvent(message);
        if (correctAnswer) {
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
        olEl.addEventListener("click", this.handleAnswerClick.bind(this, _question));
        answersEl.append(olEl);
      },
      showAnswerMessage: function(evt) {
        /* 
        * TODO: figure out why this CustomEvent doesn't dispatch in setTimeout
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
      startTimer: function() {
        const timerInterval = setInterval(function(){ 
          this.timerSeconds--;
          if (this.timerSeconds === 0) {
            clearInterval(timerInterval);
          }
        }, 1000);
      },
      timePenalty: function() {
        this.timerSeconds = this.timerSeconds - 10;
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
        // get dom elements to attach listeners
        const msgEl = document.getElementById("msg");
        const timerEl = document.getElementById("quizTimer");
        const quizEl = document.getElementById("quiz");
        // attach the custom event listeners
        document.addEventListener(events.DISPLAY_RESPONSE, this.showAnswerMessage.bind(this));
        timerEl.addEventListener(events.REDUCE_TIME, this.timePenalty.bind(this));
        //TODO: make this work
        //quizEl.addEventListener(events.NEXT_QUESTION, function(){ console.log("got it")});
        /* hide intro screen */
        const startScreen = document.getElementById("startScreen");
        startScreen.style.display = 'none';
        // show first question and start timer
        this.renderQuestion(this.quizData.questions[0]);
        this.startTimer();
      },
      finishQuiz: function() {
        let quiz = document.getElementById("quiz");
        document.getElementById("question").innerHTML = "";
        document.getElementById("answers").innerHTML = "";
        quiz.style.display = "none";
        const finalEl = document.getElementById("finalScreen");
        finalEl.innerHTML = `Final Score: ${this.score}`;
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
    console.log('start', newTest)
    newTest.startQuiz();
  });
}

initApp();