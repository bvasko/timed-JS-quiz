# Timed Javascript Quiz

## About
WIP - Timed javascript quiz

Todos:
- show timer
- increment score
## Usage
Take the quiz here: https://bvasko.github.io/timed-JS-quiz/

## Screenshots
### Running the app locally
This app is vanilla JS and uses no frameworks.
Data for the quiz is found in questions.js
All interactivity is contained in main.js

### App Setup
When a quiz answer is clicked on, several things need to update. Some attempt was made to decouple the updates from the click with custom events.

Pattern:
1. Click on a thing
2. Dispatch custom events from the click handler
3. Listeners respond to custom events

The Quiz.startQuiz method adds the event listeners to the dom elements.
There is an events dictionary so you can see custom events at a glance. This also provides some validation when events are referenced.
## License

## Credits

CSS Reset by Josh Comeau: https://www.joshwcomeau.com/css/custom-css-reset/
Index.html starter from HTML5 Boilerplate: https://github.com/h5bp/html5-boilerplate/blob/main/dist/index.html