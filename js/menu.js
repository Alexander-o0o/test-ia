/* eslint-disable import/extensions */
/* eslint-disable no-underscore-dangle */
import Button from './button.js';

class Menu {
  constructor({
    text = '',
    iconElement = document.createElement('i'),
    buttonClass,
    itemsClass,
    hideOnClick = true,
    position = Menu.position.BOTTOM,
    isHorizontal = false,
    isNonfree = false,
  }) {
    this._isOpened = false;

    this._text = text;
    this._hideOnClick = hideOnClick;
    this._button = new Button({ text, iconElement });
    this._button.element.classList.add('menu__button');
    if (buttonClass) this._button.element.classList.add(buttonClass);
    this._onButtonClick = this._onButtonClick.bind(this);
    this._button.element.addEventListener('click', this._onButtonClick);

    this._itemsElement = document.createElement('div');
    this._itemsElement.classList.add('menu__items', 'hidden');
    if (itemsClass) this._itemsElement.classList.add(itemsClass);
    if (isHorizontal) this._itemsElement.classList.add('menu__items--horizontal');

    this._element = document.createElement('span');
    this._element.classList.add(
      'menu',
      `menu--${position}`.toLowerCase(),
    );
    if (isNonfree) this._element.classList.add('menu--nonfree');

    this._element.append(
      this._button.element,
      this._itemsElement,
    );

    this._toggleMenu = this._toggleMenu.bind(this);
    this._element.addEventListener('click', this._toggleMenu);

    this._watchOuterClick = this._watchOuterClick.bind(this);
  }

  get element() {
    return this._element;
  }

  get text() {
    return this._button.text;
  }

  set text(value) {
    this._button.text = value;
  }

  setIcon(iconElement) {
    this._button.setIcon(iconElement);
  }

  addItem(element) {
    const itemElement = document.createElement('div');
    itemElement.classList.add('menu__item');
    itemElement.append(element);
    this._itemsElement.append(itemElement);
  }

  _watchOuterClick() {
    if (!this._isInnerClick) {
      document.removeEventListener('click', this._watchOuterClick);
      this._isOpened = false;
      this._itemsElement.classList.add('hidden');
    }
    delete this._isInnerClick;
  }

  _onButtonClick() {
    this._isButtonClick = true;
  }

  _toggleMenu() {
    this._isInnerClick = true;

    if (!this._hideOnClick
      && this._isOpened
      && !this._isButtonClick
    ) {
      delete this._isButtonClick;
      return;
    }
    delete this._isButtonClick;

    if (!this._isOpened) {
      document.addEventListener('click', this._watchOuterClick);
    } else {
      document.removeEventListener('click', this._watchOuterClick);
    }

    this._isOpened = !this._isOpened;
    this._itemsElement.classList.toggle('hidden');
  }
}
Menu.position = {
  TOP: 'TOP',
  RIGHT: 'RIGHT',
  BOTTOM: 'BOTTOM',
  LEFT: 'LEFT',
};

export default Menu;
