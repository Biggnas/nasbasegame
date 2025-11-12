// === BASE RUNNER — WIDE SPACING FIX v2 ===

const stage = document.getElementById("stage");
const runner = document.getElementById("runner");
const obstaclesContainer = document.getElementById("obstacles");

const scoreEl = document.getElementById("score");
const hiEl = document.getElementById("hi");

const startOverlay = document.getElementById("startOverlay");
const gameOverOverlay = document.getElementById("gameOverOverlay");
const startBtn = document.getElementById("startBtn");
const retryBtn = document.getElementById("retryBtn");
const finalScoreEl = document.getElementById("finalScore");

let gameRunning = false;
let score = 0;
let highScore = 0;

let yVelocity = 0;
let gravity = 0.37;
const jumpForce = 8.9;
let isJumping = false;

let gameSpeed = 3.0;
const speedIncreaseRate = 0.0009;

// 🧠 Extra large spacing — guaranteed delay between spawns
let nextSpawnTime = 0;
let lastSpawnTime = 0;

let obstacleTimer = null;

function startGame() {
  clearTimeout(obstacleTimer);

  gameRunning = true;
  score = 0;
  scoreEl.textContent = score;
  gameSpeed = 3.0;

  startOverlay.style.display = "none";
  gameOverOverlay.style.display = "none";
  obstaclesContainer.innerHTML = "";

  yVelocity = 0;
  isJumping = false;
  runner.style.bottom = "6px";

  nextSpawnTime = Date.now() + 1200; // start delay
  requestAnimationFrame(gameLoop);
}

function endGame() {
  gameRunning = false;
  clearTimeout(obstacleTimer);

  if (score > highScore) {
    highScore = score;
    hiEl.textContent = highScore;
  }

  finalScoreEl.textContent = Math.floor(score);
  gameOverOverlay.style.display = "flex";
}

function jump() {
  if (!gameRunning || isJumping) return;
  isJumping = true;
  yVelocity = jumpForce;
}

function spawnObstacle() {
  const obstacle = document.createElement("div");
  obstacle.classList.add("obstacle");

  const height = 24 + Math.random() * 10;
  obstacle.style.height = `${height}px`;
  obstacle.style.right = "-40px";
  obstaclesContainer.appendChild(obstacle);
}

function gameLoop() {
  if (!gameRunning) return;

  score += 0.01;
  scoreEl.textContent = Math.floor(score);
  gameSpeed += speedIncreaseRate;

  yVelocity -= gravity;
  let newBottom = parseFloat(getComputedStyle(runner).bottom) + yVelocity;

  if (newBottom <= 6) {
    newBottom = 6;
    yVelocity = 0;
    isJumping = false;
  }
  runner.style.bottom = `${newBottom}px`;

  // 🧱 obstacle logic
  const now = Date.now();
  if (now >= nextSpawnTime) {
    spawnObstacle();

    // always big spacing (1.2s–2.2s delay)
    const delay = 1200 + Math.random() * 1000;
    nextSpawnTime = now + delay;
  }

  const obstacles = document.querySelectorAll(".obstacle");
  obstacles.forEach(obstacle => {
    const right = parseFloat(getComputedStyle(obstacle).right);
    obstacle.style.right = `${right + gameSpeed}px`;

    if (right > stage.offsetWidth + 40) obstacle.remove();

    const runnerRect = runner.getBoundingClientRect();
    const obsRect = obstacle.getBoundingClientRect();

    const overlapX = !(runnerRect.right - 16 < obsRect.left || runnerRect.left + 16 > obsRect.right);
    const overlapY = !(runnerRect.bottom - 8 < obsRect.top || runnerRect.top + 8 > obsRect.bottom);

    if (overlapX && overlapY) {
      endGame();
    }
  });

  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    if (!gameRunning) startGame();
    else jump();
  }
});

stage.addEventListener("click", () => {
  if (!gameRunning) startGame();
  else jump();
});

startBtn.onclick = startGame;
retryBtn.onclick = startGame;
