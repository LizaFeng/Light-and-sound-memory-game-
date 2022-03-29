const clueHoldTime = 1000; //how long to hold each clue's light/sound
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence

//Global variables
var pattern = [2, 2, 4, 3, 2, 1, 2, 4]; //Keeps track of the secret parttern of button presses
var progress = 0; //assigns int to represent how far along player is in guessing button
var gamePlaying = false; //keep track of whether game is currently active. Remain true until lose or stop
var tonePlaying = false;
var volume = 0.5; //Must be between 0.0 and 1.0
var guessCounter = 0;
var tries_left=3;

function startGame() {
  //initialize game variables
  progress = 0;
  gamePlaying = true;

  //swap the start and stop button
  //document = keyword in javascript represents the page's DOM as a javascript
  //classList is a property representing the list of CSS classes that an element belongs to
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");

  playClueSequence();
}

function stopGame() {
  //dont need to set the progress at the end of the game

  gamePlaying = false;
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
}

//two functions for lighting or clearing a button
function lightButton(btn) {
  document.getElementById("button" + btn).classList.add("lit");
}
function clearButton(btn) {
  document.getElementById("button" + btn).classList.remove("lit");
}

//adding a function for playing a single clue
function playSingleClue(btn) {
  if (gamePlaying) {
    lightButton(btn);
    playTone(btn, clueHoldTime);
    setTimeout(clearButton, clueHoldTime, btn);
  }
}

function playClueSequence() {
  guessCounter = 0;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for (let i = 0; i <= progress; i++) {
    // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms");
    setTimeout(playSingleClue, delay, pattern[i]); // set a timeout to play that clue
    delay += clueHoldTime;
    delay += cluePauseTime;
  }
}

function guess(btn) {
  console.log("user guessed: " + btn);
  if (!gamePlaying) {
    return;
  }
  if (pattern[guessCounter] == btn) {
    //Guess was correct!
    if (guessCounter == progress) {
      if (progress == pattern.length - 1) {
        //GAME OVER: WIN!
        winGame();
      } else {
        //Pattern correct. Add next segment
        progress++;
        playClueSequence();
      }
    } else {
      //so far so good... check the next guess
      guessCounter++;
    }
  } else {
    //If player has tries left
    if(tries_left>0){
      tries_left-=1;
      alert("Player has " + tries_left + " left. Sequence will be repeated")   
      playClueSequence();
    }
    //Out of tries
    //GAME OVER: LOSE!
    if(tries_left==0)
      loseGame();
  }

  // add game logic here
}

function loseGame() {
  stopGame();
  alert("Game Over. You lost.");
}

function winGame() {
  stopGame();
  alert("Game Over. You won!");
}

// Sound Synthesis Functions
const freqMap = {
  1: 300,
  2: 340,
  3: 400,
  4: 425,
  5: 450,
  6:  500
};
function playTone(btn, len) {
  o.frequency.value = freqMap[btn];
  g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
  context.resume();
  tonePlaying = true;
  setTimeout(function () {
    stopTone();
  }, len);
}
function startTone(btn) {
  if (!tonePlaying) {
    context.resume();
    o.frequency.value = freqMap[btn];
    g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
    context.resume();
    tonePlaying = true;
  }
}
function stopTone() {
  g.gain.setTargetAtTime(0, context.currentTime + 0.05, 0.025);
  tonePlaying = false;
}

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var o = context.createOscillator();
var g = context.createGain();
g.connect(context.destination);
g.gain.setValueAtTime(0, context.currentTime);
o.connect(g);
o.start(0);
