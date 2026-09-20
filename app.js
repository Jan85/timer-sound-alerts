const elapsedText = document.getElementById('elapsed');
const intervalNoteText = document.getElementById('interval-note');
const intervalSelect = document.getElementById('interval-select');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const resetBtn = document.getElementById('reset-btn');

let intervalId = null;
let isRunning = false;
let startTime = null; // performance.now() when the timer last started/resumed
let elapsedSeconds = 0; // total seconds counted so far (persists across pauses)
let lastAnnouncedSecond = 0; // last elapsed second at which an announcement played
let announceIntervalSeconds = Number(intervalSelect.value);

function formatClock(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function formatSpoken(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const parts = [];
  if (minutes > 0) parts.push(`${minutes} minute${minutes === 1 ? '' : 's'}`);
  if (seconds > 0 || minutes === 0) parts.push(`${seconds} second${seconds === 1 ? '' : 's'}`);
  return parts.join(' ');
}

function updateDisplay() {
  elapsedText.textContent = formatClock(elapsedSeconds);
}

function announce(totalSeconds) {
  if (!window.speechSynthesis) return;
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(formatSpoken(totalSeconds));
  speechSynthesis.speak(utterance);
}

function tick() {
  const now = performance.now();
  const newElapsedSeconds = elapsedSeconds + Math.floor((now - startTime) / 1000);

  if (newElapsedSeconds > lastAnnouncedSecond) {
    for (let second = lastAnnouncedSecond + 1; second <= newElapsedSeconds; second++) {
      if (second % announceIntervalSeconds === 0) {
        announce(second);
      }
    }
    lastAnnouncedSecond = newElapsedSeconds;
  }

  if (newElapsedSeconds !== elapsedSeconds) {
    elapsedSeconds = newElapsedSeconds;
    updateDisplay();
  }
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;
  startTime = performance.now();
  // Speak a silent-ish placeholder on the user gesture to unlock speech synthesis on iOS Safari.
  if (window.speechSynthesis && elapsedSeconds === 0 && lastAnnouncedSecond === 0) {
    speechSynthesis.speak(new SpeechSynthesisUtterance(''));
  }
  intervalId = setInterval(tick, 200);
  startBtn.disabled = true;
  stopBtn.disabled = false;
}

function stopTimer() {
  if (!isRunning) return;
  isRunning = false;
  clearInterval(intervalId);
  intervalId = null;
  startBtn.disabled = false;
  stopBtn.disabled = true;
}

function resetTimer() {
  stopTimer();
  if (window.speechSynthesis) speechSynthesis.cancel();
  elapsedSeconds = 0;
  lastAnnouncedSecond = 0;
  updateDisplay();
}

function updateIntervalNote() {
  intervalNoteText.textContent = `Announces every ${announceIntervalSeconds} seconds`;
}

function handleIntervalChange() {
  announceIntervalSeconds = Number(intervalSelect.value);
  updateIntervalNote();
}

startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);
intervalSelect.addEventListener('change', handleIntervalChange);

window.addEventListener('load', () => {
  updateDisplay();
  updateIntervalNote();
});
