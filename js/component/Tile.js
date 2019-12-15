export default class Tile {
  constructor(holder, iconName) {
    this._holder = holder;
    this._iconName = iconName;
    this._iconRef = this.generateHTML();
    // this.setUpEvents();
    // console.log(this._iconRef);
  }

  generateHTML() {
    this._holder.insertAdjacentHTML(
      'beforeend',
      `<li class="memory__card">
          <i class=' memory__card__front fa fa-${this._iconName} fa-5x'></i>
      </li>
     `
    );
    return [...this._holder.querySelectorAll('.memory__card')].reverse()[0];
  }
}
