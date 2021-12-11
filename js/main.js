/**
 * Setup App Structure
 * 
 */
const Quiz = function app() {
  return {
      timer: false,
      getQuestions: function getQuestions(){
        console.log('data', data());
        return data();
      }
  }
};

const newTest = Quiz();
newTest.getQuestions();

/**
 * Pseudocode
 * 
 * Start App initializes the first screen where user presses 'start quiz'
 * 
 * attach listener to 'start quiz' -- run startQuiz function
 * 
 * startQuiz()
 * - initializes countdown timer
 * - shows progress bar
 * - initializes _score
 * - initializes question counter to store which question user is on
 * - loads first question & answers
 * - starts countdown timer
 * 
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