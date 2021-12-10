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