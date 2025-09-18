let workTime = 0;
let breakTime = 0;

let timerTime = document.getElementById("timer-time");
let sessionDescription = document.getElementsByClassName("session-description");

const alarm = new Audio("alarm.wav");

const preset25 = document.getElementById("preset25_5");
const preset30 = document.getElementById("preset30_10");
const preset40 = document.getElementById("preset45_15");

preset25.addEventListener("click", () => selectPreset(25, 5, preset25));
preset30.addEventListener("click", () => selectPreset(30, 10, preset30));
preset40.addEventListener("click", () => selectPreset(45, 15, preset40));

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const stopBtn = document.getElementById("stopBtn");

let currentTime = 0;
let isRunning = false;
let isWorkSession = true;
let timerInterval = null;

function playAlarm() {
    alarm.play();

    setTimeout(() => {
        alarm.pause();
        alarm.currentTime = 0; 
    }, 3000);
}

function showToast(message) {
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);

    setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function selectPreset(work, brk, timeOptionButton) {
    workTime = work;
    breakTime = brk;

    showToast(`Selected: ${work} min work, ${brk} min break`);

    const presetButtons = document.querySelectorAll(".timer-options button");

    presetButtons.forEach(timeOptionButton => {
        timeOptionButton.addEventListener("click", () => {
            presetButtons.forEach(btn => btn.classList.remove("selected"));
            timeOptionButton.classList.add("selected");
        });
    });
}

startBtn.addEventListener("click", () => {
    if (workTime === 0) {
        alert("Please select a time preset first!");
        return;
    }

    if (!isRunning) {
        console.log("start button clicked");
        startTimer();
    }
});

pauseBtn.addEventListener("click", () => {
    if (workTime === 0 || !isRunning) {
        alert("You haven't started working. You cannot pause.");
        return;
    }

    clearInterval(timerInterval);
    isRunning = false;
    startBtn.disabled = false; 
    console.log("Timer paused");
});

stopBtn.addEventListener("click", () => {
    if (workTime === 0 || !isRunning) {
        alert("You haven't started working. You cannot stop.");
        return;
    }

    clearInterval(timerInterval);
    isRunning = false;
    currentTime = 0;
    updateDisplay();
    isWorkSession = false;
    updateSessionDescription(isWorkSession);

    startBtn.disabled = false;
    pauseBtn.disabled = true;
    stopBtn.disabled = true;

    console.log("Timer stopped");
});

function startTimer() {
    if (currentTime === 0) {
        currentTime = workTime * 60;
        isWorkSession = true;
        updateSessionDescription(isWorkSession);
    }

    isRunning = true;

    startBtn.disabled = true;
    pauseBtn.disabled = false;
    stopBtn.disabled = false;

    timerInterval = setInterval(() => {
        currentTime--;
        updateDisplay();

        if (currentTime <= 0) {
            console.log("session ended");
            handleTimerComplete();
        }

    }, 1000);
    playAlarm();
}

function updateSessionDescription(isWorkSession) {
    let description = document.getElementsByClassName("session-description");

    if (isWorkSession) {
        description[0].textContent = "Deep focus time - minimize distractions and stay concentrated";
    }
    else if (!isWorkSession) {
        description[0].textContent = "Break time - relax and recharge";
    }
}

function updateDisplay() {
    const minutes = Math.floor(currentTime / 60);
    const seconds = currentTime % 60;
    timerTime.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function handleTimerComplete() {
    clearInterval(timerInterval);

    if (isWorkSession) {
        isWorkSession = false;
        currentTime = breakTime * 60;
        updateSessionDescription(isWorkSession);
        playAlarm();
        startTimer();
    }
    else {
        currentTime = 0;
        startTimer();
    }
}