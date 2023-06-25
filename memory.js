const cards = document.querySelectorAll('.memory-card');
const startButton = document.getElementById('start-button');
const scoreValue = document.getElementById('score-value');
const timerValue = document.getElementById('timer-value');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let score = 0;
let timerInterval;
let seconds = 0;
let minutes = 0;

startButton.addEventListener('click', startGame);

function startGame() {
  startButton.removeEventListener('click', startGame);
  startButton.style.display = 'none';

  startTimer();
  shuffleCards();
  enableCards();
  showCards();
}

function flipCard() {
  if (lockBoard || this === firstCard) return;
  this.classList.add('flip');
  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
    return;
  }
  secondCard = this;
  lockBoard = true;
  checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  resetBoard();
  hideMatchedCards();
  updateScore();
  checkGameEnd();
}

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');
    resetBoard();
  }, 1500);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

function enableCards() {
  cards.forEach(card => card.addEventListener('click', flipCard));
  lockBoard = false;
}

function shuffleCards() {
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * 20);
    card.style.order = randomPos;
  });
}

function showCards() {
  document.querySelector('.container').classList.add('show-cards');
}

function hideMatchedCards() {
  const matchedCards = document.querySelectorAll('.memory-card.flip');
  setTimeout(() => {
    matchedCards.forEach(card => {
      card.style.opacity = 0;
      card.addEventListener('transitionend', () => {
        card.style.visibility = 'hidden';
      }, { once: true });
    });
  }, 1500);
}

function updateScore() {
  score += 1;
  scoreValue.textContent = score;
}

function startTimer() {
  timerInterval = setInterval(() => {
    seconds++;
    if (seconds === 60) {
      seconds = 0;
      minutes++;
    }
    updateTimer();
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function updateTimer() {
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
  timerValue.textContent = `${formattedMinutes}:${formattedSeconds}`;
}

function checkGameEnd() {
  const remainingCards = document.querySelectorAll('.memory-card:not(.flip)');
  if (remainingCards.length === 0) {
    stopTimer();
  }
}

const restartButton = document.getElementById('restart-button');

restartButton.addEventListener('click', restartGame);

function restartGame() {
  location.reload();
}



