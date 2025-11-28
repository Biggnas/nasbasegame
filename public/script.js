// === ANIME RUNNER GAME - FULL WORKING VERSION ===

console.log("Game script loaded");

// Game state variables
var gameRunning = false;
var score = 0;
var highScore = 0;
var yVelocity = 0;
var isJumping = false;
var gameSpeed = 3.0;
var nextSpawnTime = 0;
var frameCount = 0;

// DOM Elements
var stage, runner, obstaclesContainer, scoreEl, hiEl;
var startOverlay, gameOverOverlay, startBtn, retryBtn, finalScoreEl;

// Wait for page to load
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM is ready");
  
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
  
  // Check if all elements exist
  if (stage && runner && obstaclesContainer && scoreEl && hiEl && 
      startOverlay && gameOverOverlay && startBtn && retryBtn && finalScoreEl) {
    
    console.log("All game elements found");
    
    // Set up event listeners
    startBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log("Start button clicked");
      startGame();
    });
    
    retryBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log("Retry button clicked");
      startGame();
    });
    
    stage.addEventListener('click', function() {
      console.log("Stage clicked");
      if (!gameRunning) {
        startGame();
      } else {
        jump();
      }
    });
    
    document.addEventListener('keydown', function(e) {
      if (e.code === "Space") {
        if (!gameRunning) {
          startGame();
        } else {
          jump();
        }
      }
    });
    
    // Initialize high score
    hiEl.textContent = highScore;
    
    console.log("Game initialized successfully");
  } else {
    console.error("Missing game elements:");
    console.log("stage:", !!stage);
    console.log("runner:", !!runner);
    console.log("obstaclesContainer:", !!obstaclesContainer);
    console.log("scoreEl:", !!scoreEl);
    console.log("hiEl:", !!hiEl);
    console.log("startOverlay:", !!startOverlay);
    console.log("gameOverOverlay:", !!gameOverOverlay);
    console.log("startBtn:", !!startBtn);
    console.log("retryBtn:", !!retryBtn);
    console.log("finalScoreEl:", !!finalScoreEl);
  }
});

// Start the game
function startGame() {
  console.log("Starting game");
  
  // Reset game state
  gameRunning = true;
  score = 0;
  scoreEl.textContent = score;
  gameSpeed = 3.0;
  yVelocity = 0;
  isJumping = false;
  frameCount = 0;
  nextSpawnTime = Date.now() + 1500; // First obstacle after 1.5 seconds
  
  // Hide overlays
  startOverlay.style.display = "none";
  gameOverOverlay.style.display = "none";
  
  // Clear obstacles
  obstaclesContainer.innerHTML = "";
  
  // Position runner
  runner.style.bottom = "6px";
  
  // Start game loop
  gameLoop();
}

// Jump function
function jump() {
  if (!gameRunning || isJumping) return;
  isJumping = true;
  yVelocity = 8.9;
}

// Spawn obstacle
function spawnObstacle() {
  const obstacle = document.createElement("div");
  obstacle.className = "obstacle";
  obstacle.style.right = "-30px"; // Start off-screen to the right
  obstaclesContainer.appendChild(obstacle);
}

// Game loop
function gameLoop() {
  if (!gameRunning) return;
  
  frameCount++;
  
  // Update score (slower now)
  if (frameCount % 5 === 0) { // Only update score every 5 frames
    score += 0.1;
    scoreEl.textContent = Math.floor(score);
  }
  
  // Apply gravity
  yVelocity -= 0.37;
  var newBottom = parseFloat(runner.style.bottom || "6") + yVelocity;
  
  if (newBottom <= 6) {
    newBottom = 6;
    yVelocity = 0;
    isJumping = false;
  }
  
  runner.style.bottom = newBottom + "px";
  
  // Spawn obstacles
  const now = Date.now();
  if (now >= nextSpawnTime) {
    spawnObstacle();
    nextSpawnTime = now + 1000 + Math.random() * 1000; // Next obstacle in 1-2 seconds
  }
  
  // Move obstacles and check collisions
  const obstacles = document.querySelectorAll(".obstacle");
  obstacles.forEach(obstacle => {
    // Move obstacle left
    const currentRight = parseFloat(obstacle.style.right || "0");
    obstacle.style.right = (currentRight + gameSpeed) + "px";
    
    // Remove obstacles that are off-screen
    if (currentRight > stage.offsetWidth) {
      obstacle.remove();
      return;
    }
    
    // Check collision (simplified)
    const runnerRect = runner.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();
    
    // Simple collision detection
    if (runnerRect.right > obstacleRect.left && 
        runnerRect.left < obstacleRect.right &&
        runnerRect.bottom > obstacleRect.top) {
      endGame();
    }
  });
  
  // Increase game speed gradually
  if (frameCount % 100 === 0) {
    gameSpeed += 0.1;
  }
  
  // Continue loop
  requestAnimationFrame(gameLoop);
}

// End game
function endGame() {
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