// === ANIME RUNNER GAME - SIMPLIFIED VERSION ===

console.log("Script loaded");

// Game variables
let gameRunning = false;
let score = 0;
let highScore = 0;
let yVelocity = 0;
let isJumping = false;

// DOM Elements
let stage, runner, obstaclesContainer, scoreEl, hiEl, startOverlay, gameOverOverlay, startBtn, retryBtn, finalScoreEl;

// Wait for the page to load
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM loaded");
  
  // Get all game elements
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
  
  // Verify all elements exist
  if (!stage || !runner || !obstaclesContainer || !scoreEl || !hiEl || 
      !startOverlay || !gameOverOverlay || !startBtn || !retryBtn || !finalScoreEl) {
    console.error("ERROR: Missing game elements");
    return;
  }
  
  console.log("All elements found");
  
  // Set up event listeners
  startBtn.addEventListener('click', function() {
    console.log("Start button clicked");
    startGame();
  });
  
  retryBtn.addEventListener('click', function() {
    console.log("Retry button clicked");
    startGame();
  });
  
  stage.addEventListener('click', function() {
    console.log("Stage clicked, gameRunning:", gameRunning);
    if (!gameRunning) {
      startGame();
    } else {
      jump();
    }
  });
  
  document.addEventListener('keydown', function(e) {
    console.log("Key pressed:", e.code);
    if (e.code === "Space") {
      if (!gameRunning) {
        startGame();
      } else {
        jump();
      }
    }
  });
  
  // Initialize high score display
  hiEl.textContent = highScore;
  
  console.log("Game initialized");
});

// Start the game
function startGame() {
  console.log("startGame() called");
  
  // Reset game state
  gameRunning = true;
  score = 0;
  scoreEl.textContent = score;
  yVelocity = 0;
  isJumping = false;
  
  // Hide overlays
  startOverlay.style.display = "none";
  gameOverOverlay.style.display = "none";
  
  // Clear obstacles
  obstaclesContainer.innerHTML = "";
  
  // Position runner
  runner.style.bottom = "6px";
  
  // Start game loop
  console.log("Starting game loop");
  gameLoop();
}

// Jump function
function jump() {
  console.log("Jump called");
  if (!gameRunning || isJumping) return;
  isJumping = true;
  yVelocity = 8.9;
  console.log("Jump executed");
}

// Game loop
function gameLoop() {
  console.log("Game loop running");
  
  if (!gameRunning) {
    console.log("Game not running, exiting loop");
    return;
  }
  
  // Update score
  score += 0.1;
  scoreEl.textContent = Math.floor(score);
  
  // Apply gravity
  yVelocity -= 0.37;
  let newBottom = parseFloat(runner.style.bottom || "6") + yVelocity;
  
  if (newBottom <= 6) {
    newBottom = 6;
    yVelocity = 0;
    isJumping = false;
  }
  
  runner.style.bottom = newBottom + "px";
  
  // Continue loop
  setTimeout(gameLoop, 16); // ~60 FPS
}

// End game
function endGame() {
  console.log("Game ended");
  gameRunning = false;
  
  // Update high score
  if (score > highScore) {
    highScore = Math.floor(score);
    hiEl.textContent = highScore;
  }
  
  // Show final score
  finalScoreEl.textContent = Math.floor(score);
  
  // Show game over screen
  gameOverOverlay.style.display = "flex";
}