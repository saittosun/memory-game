// jshint esversion: 6
import '../css/style.scss';
import Memory from './component/Memory';

let level = 0;
const gameHolder = document.getElementById('memory_cardHolder');
// START NEXT LEVEL-WIN EVENT//
const startNextLevel = function() {
  gameHolder.innerHTML = '';

  // eslint-disable-next-line no-undef
  level += 1;
  const memoryGame = new Memory(level * 2, gameHolder, level);
  console.log(memoryGame._score);
  document.querySelector('.level__nr').innerHTML = `Level: ${level}`;
};

startNextLevel();

window.addEventListener('win', startNextLevel);

// START THE SAME LEVEL-LOSE EVENT//
const startSameLevel = function() {
  gameHolder.innerHTML = '';
  const memoryGame = new Memory(level * 2, gameHolder, level);
  document.querySelector('.level__nr').innerHTML = `Level: ${level}`;
};

startSameLevel();
window.addEventListener('lose', startSameLevel);

function clickCounter(e) {
  console.log(e.target.className === 'plus');
  if (e.target.className === 'plus' && (level >= 1 && level <= 4)) {
    level += 1;
  } else if (e.target.className === 'minus' && level > 1) {
    level -= 1;
  }
  document.querySelector('.level__nr').innerHTML = `Level: ${level}`;
  gameHolder.innerHTML = '';
  const memoryGame = new Memory(level * 2, gameHolder);
}

// RESET GAME//
function resetGame() {
  // eslint-disable-next-line no-restricted-globals
  location.reload();
}
document.querySelector('.reset').addEventListener('click', resetGame);

document.querySelector('.minus').addEventListener('click', clickCounter);
document.querySelector('.plus').addEventListener('click', clickCounter);
