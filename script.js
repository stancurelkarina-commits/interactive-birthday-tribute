"use strict";

const SECRET_PASSCODE = "0108";
const screens = [...document.querySelectorAll(".screen")];
const pinDots = [...document.querySelectorAll("#pinDots span")];
const passcodeCard = document.querySelector(".passcode-card");
const passcodeError = document.getElementById("passcodeError");
const backgroundMusic = document.getElementById("backgroundMusic");
const musicButton = document.getElementById("musicButton");
const musicIcon = document.getElementById("musicIcon");
const floatingHearts = document.getElementById("floatingHearts");
const confettiLayer = document.getElementById("confettiLayer");

let enteredPin = "";
let musicStarted = false;

function showScreen(screenId) {
  screens.forEach((screen) => {
    screen.classList.toggle("active", screen.id === screenId);
  });

  if (screenId === "screen-birthday" || screenId === "screen-final") {
    launchConfetti(screenId === "screen-final" ? 90 : 55);
  }
}

function updatePinDots() {
  pinDots.forEach((dot, index) => {
    dot.classList.toggle("filled", index < enteredPin.length);
  });
}

function addPinNumber(number) {
  if (enteredPin.length >= 4) return;
  enteredPin += number;
  passcodeError.textContent = "";
  updatePinDots();

  if (enteredPin.length === 4) {
    window.setTimeout(checkPasscode, 160);
  }
}

function clearPin() {
  enteredPin = "";
  passcodeError.textContent = "";
  updatePinDots();
}

function deletePinDigit() {
  enteredPin = enteredPin.slice(0, -1);
  passcodeError.textContent = "";
  updatePinDots();
}

function checkPasscode() {
  if (enteredPin === SECRET_PASSCODE) {
    passcodeError.textContent = "Unlocked! 💖";
    startMusic();
    window.setTimeout(() => showScreen("screen-question"), 450);
    return;
  }

  passcodeError.textContent = "Wrong passcode — try again.";
  passcodeCard.classList.remove("shake");
  void passcodeCard.offsetWidth;
  passcodeCard.classList.add("shake");
  enteredPin = "";
  updatePinDots();
}

async function startMusic() {
  try {
    backgroundMusic.volume = 0.28;
    await backgroundMusic.play();
    musicStarted = true;
    musicButton.classList.add("playing");
    musicIcon.textContent = "♫";
    musicButton.setAttribute("aria-label", "Pause background music");
  } catch (error) {
    // Most browsers allow audio after the visitor taps a button.
    musicStarted = false;
  }
}

function toggleMusic() {
  if (backgroundMusic.paused) {
    startMusic();
  } else {
    backgroundMusic.pause();
    musicStarted = false;
    musicButton.classList.remove("playing");
    musicIcon.textContent = "♪";
    musicButton.setAttribute("aria-label", "Play background music");
  }
}

function createFloatingHearts() {
  const symbols = ["♥", "♡", "✿", "❀"];
  for (let index = 0; index < 24; index += 1) {
    const heart = document.createElement("span");
    heart.className = "float-heart";
    heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.animationDuration = `${7 + Math.random() * 8}s`;
    heart.style.animationDelay = `${-Math.random() * 12}s`;
    heart.style.fontSize = `${10 + Math.random() * 13}px`;
    heart.style.opacity = `${0.25 + Math.random() * 0.45}`;
    floatingHearts.appendChild(heart);
  }
}

function launchConfetti(amount = 60) {
  const colours = ["#d80c72", "#ff72ae", "#f6bf3a", "#62c96a", "#7c6ee6", "#ffffff"];

  for (let index = 0; index < amount; index += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colours[Math.floor(Math.random() * colours.length)];
    piece.style.animationDelay = `${Math.random() * 1.2}s`;
    piece.style.animationDuration = `${2.5 + Math.random() * 2}s`;
    piece.style.transform = `rotate(${Math.random() * 180}deg)`;
    confettiLayer.appendChild(piece);
    window.setTimeout(() => piece.remove(), 5200);
  }
}

function replaySurprise() {
  clearPin();
  showScreen("screen-passcode");
}

document.querySelectorAll("[data-number]").forEach((button) => {
  button.addEventListener("click", () => addPinNumber(button.dataset.number));
});

document.getElementById("clearPin").addEventListener("click", clearPin);
document.getElementById("deletePin").addEventListener("click", deletePinDigit);
document.getElementById("unlockButton").addEventListener("click", checkPasscode);
document.getElementById("showSurpriseButton").addEventListener("click", () => showScreen("screen-birthday"));
document.getElementById("noButton").addEventListener("click", () => showScreen("screen-no"));
document.getElementById("tryAgainButton").addEventListener("click", () => showScreen("screen-question"));
document.getElementById("replayButton").addEventListener("click", replaySurprise);
musicButton.addEventListener("click", toggleMusic);

document.querySelectorAll("[data-next]").forEach((button) => {
  button.addEventListener("click", () => showScreen(button.dataset.next));
});

document.querySelectorAll(".final-choice").forEach((button) => {
  button.addEventListener("click", () => showScreen("screen-final"));
});

document.addEventListener("keydown", (event) => {
  if (!document.getElementById("screen-passcode").classList.contains("active")) return;

  if (/^[0-9]$/.test(event.key)) addPinNumber(event.key);
  if (event.key === "Backspace") deletePinDigit();
  if (event.key === "Escape") clearPin();
  if (event.key === "Enter") checkPasscode();
});

// Start music on the first meaningful interaction if autoplay was blocked.
document.addEventListener(
  "pointerdown",
  () => {
    if (!musicStarted && backgroundMusic.paused) startMusic();
  },
  { once: true }
);

createFloatingHearts();
