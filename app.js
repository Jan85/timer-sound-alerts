const elapsedText = document.getElementById('elapsed');
const intervalNoteText = document.getElementById('interval-note');
const intervalSelect = document.getElementById('interval-select');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const resetBtn = document.getElementById('reset-btn');

let intervalId = null;
let isRunning = false;
let startTime = null; // performance.now() when the current running segment began
let baseSeconds = 0; // seconds accumulated from completed running segments (before this resume)
let elapsedSeconds = 0; // baseSeconds + time elapsed in the current running segment
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
  const newElapsedSeconds = baseSeconds + Math.floor((now - startTime) / 1000);

  if (newElapsedSeconds !== elapsedSeconds) {
    elapsedSeconds = newElapsedSeconds;
    updateDisplay();
  }

  if (elapsedSeconds > lastAnnouncedSecond && elapsedSeconds % announceIntervalSeconds === 0) {
    lastAnnouncedSecond = elapsedSeconds;
    announce(elapsedSeconds);
  }
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;
  startTime = performance.now();
  // Speak on the user gesture to unlock speech synthesis on iOS Safari.
  // An empty-string utterance can leave Safari's speech queue stuck, so use real text.
  if (window.speechSynthesis && elapsedSeconds === 0 && lastAnnouncedSecond === 0) {
    speechSynthesis.speak(new SpeechSynthesisUtterance('Timer started'));
  }
  intervalId = setInterval(tick, 200);
  startBtn.disabled = true;
  stopBtn.disabled = false;
}

function stopTimer() {
  if (!isRunning) return;
  isRunning = false;
  baseSeconds = elapsedSeconds; // bank the current total so a later resume continues from here
  clearInterval(intervalId);
  intervalId = null;
  startBtn.disabled = false;
  stopBtn.disabled = true;
}

function resetTimer() {
  stopTimer();
  if (window.speechSynthesis) speechSynthesis.cancel();
  baseSeconds = 0;
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
