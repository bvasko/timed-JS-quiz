# Timed Javascript Quiz

## About

## Usage
Take the quiz here: https://bvasko.github.io/timed-JS-quiz/

## Contributing

### Running the app locally
This app is vanilla JS and uses no frameworks.
Data for the quiz is found in questions.js
All interactivity is contained in main.js

### App Setup
When a quiz answer is clicked on, several things need to change in the interface. Some attempt was made to decouple these event responses from the initial click with custom events.

Pattern:
1. Click on a thing
2. Dispatch custom events from click handler
3. Listeners respond to custom events

The Quiz.startQuiz method adds the event listeners to the dom
There is an events dictionary to see custom events at a glance
## License

## Credits

CSS Reset by Josh Comeau: https://www.joshwcomeau.com/css/custom-css-reset/
Index.html starter from HTML5 Boilerplate: https://github.com/h5bp/html5-boilerplate/blob/main/dist/index.html