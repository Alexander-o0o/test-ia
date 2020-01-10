/* eslint-disable no-underscore-dangle */
class ToggleButton {
  constructor({
    text = '',
    clickHandlers = [() => {}],
    iconElement = document.createElement('i'),
  }) {
    this._text = text;
    this._clickHandlers = clickHandlers;

    this._stateIndex = 0;

    this._textElement = document.createElement('span');
    this._textElement.innerHTML = text;
    this._iconElement = iconElement;
    this._element = document.createElement('button');
    this._element.append(iconElement, this._textElement);

    this._onClick = this._onClick.bind(this);
    this.element.addEventListener('click', this._onClick);
  }

  get stateIndex() {
    return this._stateIndex;
  }

  get element() {
    return this._element;
  }

  get text() {
    return this._text;
  }

  set text(value) {
    this._text = value;
    this._textElement.innerHTML = value;
  }

  setIcon(iconElement) {
    this._iconElement.remove();
    this._iconElement = iconElement;
    this._element.append(iconElement);
  }

  _onClick() {
    this._clickHandlers[this._stateIndex](this._stateIndex);
    this._stateIndex = this._stateIndex + 1 === this._clickHandlers.length
      ? 0
      : this._stateIndex + 1;
  }
}

export default ToggleButton;
