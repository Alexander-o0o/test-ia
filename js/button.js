/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-expressions */
class Button {
  constructor({
    text = '',
    iconElement = document.createElement('i'),
  }) {
    this._text = text;

    this._textElement = document.createElement('span');
    this._textElement.innerHTML = text;
    this._iconElement = iconElement;
    this._element = document.createElement('button');
    this._element.append(iconElement, this._textElement);
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
}

export default Button;
