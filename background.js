let workTime = 0;
let breakTime = 0;
let currentTime = 0;
let isRunning = false;
let isWorkSession = true;
let timerInterval = null;

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

chrome.runtime.onStartup.addListener(loadState);
chrome.runtime.onInstalled.addListener(loadState);

function loadState() {
    chrome.storage.local.get(
        ['workTime', 'breakTime', 'currentTime', 'isRunning', 'isWorkSession'],
        (data) => {
            workTime = data.workTime;
            breakTime = data.breakTime;
            currentTime = data.currentTime;
            isRunning = data.isRunning;
            isWorkSession = data.isWorkSession;

            if (isRunning) startInterval();
        }
    );
}

function startInterval() {
    if (timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        if (!isRunning) return;

        currentTime--;
        saveState();

        if (currentTime <= 0) handleTimerComplete();
    }, 1000);
}

function handleTimerComplete() {
    if (isWorkSession) {
        isWorkSession = false;
        currentTime = breakTime * 60;

        const quote = breakQuotes[Math.floor(Math.random() * breakQuotes.length)];

        showNotification("Break Time", quote);
    } else {
        isWorkSession = true;
        currentTime = workTime * 60;

        const quote = workQuotes[Math.floor(Math.random() * workQuotes.length)];

        showNotification("Work Time", quote);

    }
    saveState();
}


function saveState() {
    chrome.storage.local.set({ workTime, breakTime, currentTime, isRunning, isWorkSession });
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === "start") {
        workTime = msg.workTime;
        breakTime = msg.breakTime;
        isWorkSession = true;
        if (!isRunning) {
            isRunning = true;
            if (currentTime <= 0) currentTime = workTime * 60;
            startInterval();
            const quote = workQuotes[Math.floor(Math.random() * workQuotes.length)];

            showNotification("Work Time", quote);
        }
        sendResponse({ status: "started" });
    }

    if (msg.action === "pause") {
        isRunning = false;
        isWorkSession = false;
        sendResponse({ status: "paused" });
    }

    if (msg.action === "stop") {
        isRunning = false;
        currentTime = 0;
        isWorkSession = false;
        saveState();
        sendResponse({ status: "stopped" });
    }

    if (msg.action === "getState") {
        sendResponse({ currentTime, isRunning, isWorkSession });
    }
    if (msg.action === "setPreset") {
        workTime = msg.workTime;
        breakTime = msg.breakTime;
        currentTime = msg.currentTime;
        saveState();
        sendResponse({ status: "preset set" });
    }
    return true;
});

function showNotification(title, message) {
    chrome.notifications.create({
        type: "basic",
        iconUrl: "focusflow-logo.png",
        title: title,
        message: message,
        priority: 1
    });
}
