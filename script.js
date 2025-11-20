// === BASE RUNNER — WIDE SPACING FIX v2 ===

// Global variables
let gameRunning = false;
let score = 0;
let highScore = 0;
let yVelocity = 0;
let gravity = 0.37;
const jumpForce = 8.9;
let isJumping = false;
let gameSpeed = 3.0;
const speedIncreaseRate = 0.0009;
let nextSpawnTime = 0;
let lastSpawnTime = 0;
let obstacleTimer = null;

// DOM Elements
let stage, runner, obstaclesContainer, scoreEl, hiEl, startOverlay, gameOverOverlay, startBtn, retryBtn, finalScoreEl;

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM Loaded - Initializing game elements");
  
  // Get all DOM elements
  stage = document.getElementById("stage");
  runner = document.getElementById("runner");
  obstaclesContainer = document.getElementById("obstacles");
  scoreEl = document.getElementById("score");
  hiEl = document.getElementById("hi");
  startOverlay = document.getElementById("startOverlay");
  gameOverOverlay = document.getElementById("gameOverOverlay");
  startBtn = document.getElementById("startBtn");
  retryBtn = document.getElementById("retryBtn");
  finalScoreEl = document.getElementById("finalScore");
  
  // Check if all elements are found
  if (!stage || !runner || !obstaclesContainer || !scoreEl || !hiEl || 
      !startOverlay || !gameOverOverlay || !startBtn || !retryBtn || !finalScoreEl) {
    console.error("Some game elements are missing from the DOM");
    return;
  }
  
  console.log("All game elements found");
  
  // Attach event listeners
  document.addEventListener("keydown", handleKeyDown);
  stage.addEventListener("click", handleStageClick);
  startBtn.addEventListener("click", startGame);
  retryBtn.addEventListener("click", startGame);
  
  // Initialize scores
  hiEl.textContent = highScore;
  
  // Try to initialize MiniApp SDK
  initializeMiniApp();
});

// Initialize MiniApp SDK if available
function initializeMiniApp() {
  try {
    if (typeof window.sdk !== 'undefined') {
      console.log("MiniApp SDK detected");
      window.sdk.actions.ready().catch(err => {
        console.log("SDK ready error:", err);
      });
    } else {
      console.log("MiniApp SDK not detected, running in standalone mode");
    }
  } catch (err) {
    console.log("Error initializing MiniApp SDK:", err);
  }
}

// Event handlers
function handleKeyDown(e) {
  if (e.code === "Space") {
    if (!gameRunning) {
      startGame();
    } else {
      jump();
    }
  }
}

function handleStageClick() {
  if (!gameRunning) {
    startGame();
  } else {
    jump();
  }
}

// Game functions
function startGame() {
  console.log("Starting game");
  
  // Clear any existing timers
  clearTimeout(obstacleTimer);
  
  // Reset game state
  gameRunning = true;
  score = 0;
  scoreEl.textContent = score;
  gameSpeed = 3.0;
  
  // Hide overlays
  startOverlay.style.display = "none";
  gameOverOverlay.style.display = "none";
  
  // Clear obstacles
  obstaclesContainer.innerHTML = "";
  
  // Reset runner
  yVelocity = 0;
  isJumping = false;
  runner.style.bottom = "6px";
  
  // Set next spawn time
  nextSpawnTime = Date.now() + 1200;
  
  // Start game loop
  requestAnimationFrame(gameLoop);
}

function endGame() {
  console.log("Ending game");
  
  gameRunning = false;
  clearTimeout(obstacleTimer);
  
  // Update high score
  if (score > highScore) {
    highScore = score;
    hiEl.textContent = highScore;
  }
  
  // Show final score
  finalScoreEl.textContent = Math.floor(score);
  
  // Show game over overlay
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
  
  // Update score and speed
  score += 0.01;
  scoreEl.textContent = Math.floor(score);
  gameSpeed += speedIncreaseRate;
  
  // Apply gravity
  yVelocity -= gravity;
  let newBottom = parseFloat(getComputedStyle(runner).bottom) + yVelocity;
  
  // Check ground collision
  if (newBottom <= 6) {
    newBottom = 6;
    yVelocity = 0;
    isJumping = false;
  }
  runner.style.bottom = `${newBottom}px`;
  
  // Spawn obstacles
  const now = Date.now();
  if (now >= nextSpawnTime) {
    spawnObstacle();
    
    // Set next spawn time
    const delay = 1200 + Math.random() * 1000;
    nextSpawnTime = now + delay;
  }
  
  // Move obstacles and check collisions
  const obstacles = document.querySelectorAll(".obstacle");
  obstacles.forEach(obstacle => {
    const right = parseFloat(getComputedStyle(obstacle).right);
    obstacle.style.right = `${right + gameSpeed}px`;
    
    // Remove obstacles that are off-screen
    if (right > stage.offsetWidth + 40) {
      obstacle.remove();
    }
    
    // Check collision
    const runnerRect = runner.getBoundingClientRect();
    const obsRect = obstacle.getBoundingClientRect();
    
    const overlapX = !(runnerRect.right - 16 < obsRect.left || runnerRect.left + 16 > obsRect.right);
    const overlapY = !(runnerRect.bottom - 8 < obsRect.top || runnerRect.top + 8 > obsRect.bottom);
    
    if (overlapX && overlapY) {
      endGame();
    }
  });
  
  // Continue game loop
  requestAnimationFrame(gameLoop);
}