// // popup.js
// const timerTime = document.getElementById("timer-time");
// const sessionDescription = document.getElementsByClassName("session-description")[0];

// const preset25 = document.getElementById("preset25_5");
// const preset30 = document.getElementById("preset30_10");
// const preset40 = document.getElementById("preset45_15");

// const startBtn = document.getElementById("startBtn");
// const pauseBtn = document.getElementById("pauseBtn");
// const stopBtn = document.getElementById("stopBtn");

// let selectedWork = 0;
// let selectedBreak = 0;

// // Preset selection
// preset25.addEventListener("click", () => selectPreset(25, 5));
// preset30.addEventListener("click", () => selectPreset(30, 10));
// preset40.addEventListener("click", () => selectPreset(45, 15));

// function selectPreset(work, brk) {
//     selectedWork = work;
//     selectedBreak = brk;
// }

// // Button handlers
// startBtn.addEventListener("click", () => {
//     chrome.runtime.sendMessage({ action: "start", workTime: selectedWork, breakTime: selectedBreak });
// });

// pauseBtn.addEventListener("click", () => {
//     chrome.runtime.sendMessage({ action: "pause" });
// });

// stopBtn.addEventListener("click", () => {
//     chrome.runtime.sendMessage({ action: "stop" });
// });

// setInterval(() => {
//     chrome.runtime.sendMessage({ action: "getState" }, (state) => {
//         const minutes = Math.floor(state.currentTime / 60);
//         const seconds = state.currentTime % 60;
//         timerTime.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

//         sessionDescription.textContent = state.isWorkSession ? "Deep focus time - minimize distractions" : "Break time - relax and recharge";
//     });
// }, 1000);



const timerTime = document.getElementById("timer-time");
const sessionDescription = document.getElementsByClassName("session-description")[0];

const preset25 = document.getElementById("preset25_5");
const preset30 = document.getElementById("preset30_10");
const preset40 = document.getElementById("preset45_15");

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const stopBtn = document.getElementById("stopBtn");

let selectedWork = 0;
let selectedBreak = 0;

const workQuotes = [
    "Deep focus: Let’s crush those tasks!",
    "Stay on target and stay unstoppable!",
    "Your focus defines your success!",
    "Work hard, stay present, achieve more!",
];
const breakQuotes = [
    "Take a deep breath and recharge!",
    "Relax, reset, and come back stronger!",
    "Break time: Your brain deserves it!",
    "Refresh your mind, fuel your focus!",
];

preset25.addEventListener("click", () => selectPreset(25, 5));
preset30.addEventListener("click", () => selectPreset(30, 10));
preset40.addEventListener("click", () => selectPreset(45, 15));

function selectPreset(work, brk) {
    selectedWork = work;
    selectedBreak = brk;

    startBtn.disabled = false;
    pauseBtn.disabled = false;
    stopBtn.disabled = false;

    timerTime.textContent = `${work.toString().padStart(2, '0')}:00`;

    chrome.runtime.sendMessage({
        action: "setPreset",
        workTime: selectedWork,
        breakTime: selectedBreak,
        currentTime: selectedWork * 60
    });
}

startBtn.addEventListener("click", () => {
    if (!selectedWork || !selectedBreak) {
        alert("Please select a preset first!");
        return;
    }

    // Send message to background
    chrome.runtime.sendMessage({ action: "start", workTime: selectedWork, breakTime: selectedBreak }, (response) => {
        if (response.status === "started") {
            const quote = workQuotes[Math.floor(Math.random() * workQuotes.length)];
            sessionDescription.textContent = quote;
        }
    });
});

pauseBtn.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "pause" }, (response) => {
        if (response.status === "paused") {
            sessionDescription.textContent = "Timer paused. Ready when you are!";
        }
    });
});

stopBtn.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "stop" }, (response) => {
        if (response.status === "stopped") {
            sessionDescription.textContent = "Timer stopped. Select a preset to start again!";
        }
    });
    startBtn.disabled = true;
    pauseBtn.disabled = true;
    stopBtn.disabled = true;
    selectedWork = 0;
    selectedBreak = 0;
});

setInterval(() => {
    chrome.runtime.sendMessage({ action: "getState" }, (state) => {
        const minutes = Math.floor(state.currentTime / 60);
        const seconds = state.currentTime % 60;
        timerTime.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    });
}, 1000);
