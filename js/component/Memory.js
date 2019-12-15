// jshint esversion: 6
import fontAwesomeList from 'font-awesome-list';
import shuffle from 'shuffle-array';
import Swal from 'sweetalert2';
import Tile from './Tile';

// const shuffle = require('shuffle-array');

export default class Memory {
  constructor(levelNr, holder, level) {
    this._levelNr = levelNr;
    this._holder = holder;
    this._clickPair = 0;
    this.boundedFunction = this.flipcard.bind(this);
    this._matchCount = 0; /* [...this._tileRef.querySelectorAll('.flip')].length === 2 can also be used instead */
    this._score = 0;
    this._level = level;
    this.setupArray();
    this._tileRef = this.generateHTML();
    this.generateTiles();
    this.setupEvents();
    this.updateScore();
  }

  setupArray() {
    this._cardArray20 = fontAwesomeList.all().map(el => el.id);
    this._cardsArray = shuffle(this._cardArray20);
    this._cardsArray.length = this._levelNr;
    this._doubledArray = [...this._cardsArray, ...this._cardsArray];
    console.log(this._doubledArray);
  }

  generateHTML() {
    this._holder.insertAdjacentHTML('beforeend', `<ul class='memory'></ul>`);
    return this._holder.querySelector('ul.memory');
  }

  generateTiles() {
    console.log(this._tileRef);
    console.log(this._holder);
    shuffle(this._doubledArray).forEach(
      iconName => new Tile(this._tileRef, iconName)
    );
    this._tileRef.style.height = `${75 * this._levelNr}px`;
  }

  flipcard(e) {
    // if (this._lockBoard) return;
    if (e.target.nodeName === 'LI') {
      // console.log(e.target.classList);
      if (!e.target.classList.contains('memory__card--flipped')) {
        const flippedNotMatched = [
          ...this._tileRef.querySelectorAll(
            '.memory__card--flipped:not(.memory__card--matched)'
          ),
        ];
        if (flippedNotMatched.length === 0) {
          e.target.classList.add('memory__card--flipped');
        } else {
          e.target.classList.add('memory__card--flipped');
          this._tileRef.removeEventListener('click', this.boundedFunction);
          setTimeout(
            function() {
              // console.log(flippedNotMatched);
              const flipped = [
                ...this._tileRef.querySelectorAll(
                  '.memory__card--flipped:not(.memory__card--matched)'
                ),
              ];
              if (
                flipped[0].querySelector('i').classList.toString() ===
                flipped[1].querySelector('i').classList.toString()
              ) {
                // it is a match
                flipped[0].querySelector('i').style.background = 'yellow';
                flipped[1].querySelector('i').style.background = 'yellow';
                flipped.forEach(el =>
                  el.classList.add('memory__card--matched')
                );
                this._clickPair += 1;
                this._matchCount += 1;
                console.log(`Matched==${this._matchCount}`);
              } else {
                // not a match
                this._clickPair += 1;
                console.log(`Guess==${this._clickPair}`);
                flipped.forEach(el =>
                  el.classList.remove('memory__card--flipped')
                );
              }
              this._score = (this._matchCount / this._clickPair).toFixed(2);
              // eslint-disable-next-line no-restricted-globals
              if (!isNaN(this._score)) {
                this._holder.previousElementSibling.innerHTML = `Percentage:  ${(
                  this._score * 100
                ).toFixed(2)} %`;
              }
              if (this._matchCount === this._levelNr) {
                let text0 = '';
                let text1 = '';
                // eslint-disable-next-line no-cond-assign
                if (this._score > 0.7) {
                  text1 = 'Waw! Can you be a genius?';
                  text0 = 'Congrats!';
                } else if (this._score > 0.5) {
                  text1 = 'Not bad at all!';
                  text0 = 'Congrats!';
                } else {
                  text1 = `Don't give up! You can try from the beggining or select your level from above.`;
                  text0 = 'Pull yourself up dude!';
                }
                Swal.fire({
                  title: `${text0}`,
                  text: `${text1} Your score is  ${(this._score * 100).toFixed(
                    2
                  )} %; You found in ${
                    this._clickPair
                  } guesses. Pick a new level`,
                  imageUrl: 'https://unsplash.it/400/200',
                  imageWidth: 400,
                  imageHeight: 200,
                  imageAlt: 'Custom image',
                  animation: true,
                });
                // this.updateScore();
                if (this._score >= 0.5) {
                  window.dispatchEvent(this._winEvent);
                } else {
                  window.dispatchEvent(this._loseEvent);
                }
              }
              this.setupEvents();
            }.bind(this),
            600
          );
        }
        console.log('function runs', this._clickPair, this._matchCount);
      }
    }
  }

  updateScore() {
    this._score = this._matchCount / this._clickPair;
    this._level = this._matchCount / 2;
    console.log(this._matchCount / 2);
  }

  setupEvents() {
    this._winEvent = new CustomEvent('win');
    this._loseEvent = new CustomEvent('lose');
    this._tileRef.addEventListener('click', this.boundedFunction);
  }
}
