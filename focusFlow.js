//global variables
let workTime = 0;
let breakTime = 0;

/*
let totalTime = 0;
later add feature that shows the total time you have done the pomodoro timer once you have clicked start it will keep going till you click stop button.
*/
let timerDisplay = document.getElementById("timer-time");
let sessionDescription = document.getElementsByClassName("session-description");

// DOM elements
const preset25 = document.getElementById("preset25/5");
const preset30 = document.getElementById("preset30/10");
const preset40 = document.getElementById("preset40/15");

function selectPreset(work, brk, timeOptionButton) {
    workTime = work;
    breakTime = brk;

    console.log(`Work: ${work}, Break: ${brk}`);

    const presetButtons = document.querySelectorAll(".timer-options button");

    presetButtons.forEach(timeOptionButton => {
        timeOptionButton.addEventListener("click", () => {
            presetButtons.forEach(btn => btn.classList.remove("selected"));

            timeOptionButton.classList.add("selected");

            console.log("Selected: ", timeOptionButton.textContent);
        });
    });
}

preset25.addEventListener("click", () => selectPreset(.5, .5, preset25));
preset30.addEventListener("click", () => selectPreset(30, 10, preset30));
preset40.addEventListener("click", () => selectPreset(45, 15, preset40));

/*
-> what to do when user has clicked on a time option and has clicked "start"
when this action happens => the time starts counting backwards from "workTime"
the session description changes to something like "Deep focus time - minimize distractions and stay concentrated"
once timer is at 00:00 => timer sound rings then break starts counting backwards
*/

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const stopBtn = document.getElementById("stopBtn");

let currentTime = 0;
let isRunning = false;
let isWorkSession = true;
let timerInterval = null;

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
    if (workTime === 0) {
        alert("You haven't started working. You cannot pause.");
        return;
    }
    console.log("pause button clicked");
    /* how to pause the time?
    -> once the user has started a session and clicks on pause button -> the timer stops until start button is clicked again
    mess with updateDisplay()

    */
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
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// handles timer completion
function handleTimerComplete() {
    clearInterval(timerInterval);
    if (isWorkSession) {
        isWorkSession = false;
        currentTime = breakTime * 60;
        updateSessionDescription(isWorkSession);
        startTimer();
    }
    else {
        currentTime = 0;
        startTimer();
    }
}
