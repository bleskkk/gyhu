
// Theme switching
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('change', () => {
  document.body.setAttribute('data-theme', themeToggle.checked ? 'dark' : 'light');
});



// Game variables
let score = 0;
let highScore = 0;
let gameActive = false;
let timeLeft = 30;
let difficulty = 'easy';
let gameInterval;
let timerInterval;

const cat = document.getElementById('cat');
const gameArea = document.getElementById('game-area');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('highScore');
const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('start-game');
const difficultySelect = document.getElementById('difficulty');

// Achievements
const achievements = {
  beginner: { score: 10, element: document.getElementById('achievement-beginner') },
  pro: { score: 25, element: document.getElementById('achievement-pro') },
  master: { score: 50, element: document.getElementById('achievement-master') }
};

function showNotification(message) {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.classList.add('show');
  setTimeout(() => notification.classList.remove('show'), 3000);
}

function checkAchievements(currentScore) {
  for (const [key, achievement] of Object.entries(achievements)) {
    if (currentScore >= achievement.score && !achievement.element.classList.contains('unlocked')) {
      achievement.element.classList.add('unlocked');
      showNotification(`Achievement Unlocked: ${key.charAt(0).toUpperCase() + key.slice(1)}!`);
    }
  }
}

function getDifficultySettings() {
  const settings = {
    easy: { interval: 1500, size: '24px' },
    medium: { interval: 1000, size: '20px' },
    hard: { interval: 700, size: '16px' }
  };
  return settings[difficulty];
}

function moveCat() {
  if (!gameActive) return;
  
  const maxX = gameArea.clientWidth - 40;
  const maxY = gameArea.clientHeight - 40;
  
  const newX = Math.random() * maxX;
  const newY = Math.random() * maxY;
  
  cat.style.left = newX + 'px';
  cat.style.top = newY + 'px';
  cat.style.fontSize = getDifficultySettings().size;
}

function catchCat() {
  if (!gameActive) return;
  
  score++;
  scoreDisplay.textContent = score;
  checkAchievements(score);
  
  if (score > highScore) {
    highScore = score;
    highScoreDisplay.textContent = highScore;
    showNotification('New High Score!');
  }
  
  cat.style.animation = 'bounce 0.5s';
  setTimeout(() => cat.style.animation = '', 500);
  
  moveCat();
}

function updateTimer() {
  timerDisplay.textContent = timeLeft;
  if (timeLeft <= 0) {
    endGame();
  }
  timeLeft--;
}

function endGame() {
  gameActive = false;
  clearInterval(gameInterval);
  clearInterval(timerInterval);
  startButton.textContent = 'Play Again';
  showNotification(`Game Over! Score: ${score}`);
  gameArea.style.animation = 'shake 0.5s';
  setTimeout(() => gameArea.style.animation = '', 500);
}

function startGame() {
  score = 0;
  timeLeft = 30;
  scoreDisplay.textContent = score;
  timerDisplay.textContent = timeLeft;
  gameActive = true;
  difficulty = difficultySelect.value;
  
  startButton.textContent = 'Reset Game';
  
  clearInterval(gameInterval);
  clearInterval(timerInterval);
  
  gameInterval = setInterval(moveCat, getDifficultySettings().interval);
  timerInterval = setInterval(updateTimer, 1000);
  
  moveCat();
}

cat.addEventListener('click', catchCat);
startButton.addEventListener('click', startGame);
difficultySelect.addEventListener('change', () => {
  if (gameActive) {
    clearInterval(gameInterval);
    gameInterval = setInterval(moveCat, getDifficultySettings().interval);
  }
});

// Initial stats update
updateStats();
