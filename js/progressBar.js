/* eslint-disable no-underscore-dangle */
class PropgressBar {
  constructor({
    isVertical = false,
    mouseDownHandler = () => {},
    mouseMoveHandler = () => {},
    mouseUpHandler = () => {},
  }) {
    this._value = 0;
    this._isInEditing = false;
    this._isVertical = isVertical;

    this._mouseDownHandler = mouseDownHandler;
    this._mouseMoveHandler = mouseMoveHandler;
    this._mouseUpHandler = mouseUpHandler;

    this._element = document.createElement('span');
    this._contentElement = document.createElement('span');
    this._backgroundElement = document.createElement('span');
    this._progressElement = document.createElement('span');
    this._handlerAreaElement = document.createElement('span');
    this._buttonElement = document.createElement('span');

    this._element.classList.add('progress-bar');
    this._contentElement.classList.add('progress-bar__content');
    this._backgroundElement.classList.add('progress-bar__background');
    this._progressElement.classList.add('progress-bar__progress');
    this._handlerAreaElement.classList.add('progress-bar__handle-area');
    this._buttonElement.classList.add('progress-bar__button');

    this._contentElement.append(
      this._backgroundElement,
      this._progressElement,
      this._handlerAreaElement,
      this._buttonElement,
    );

    this._element.append(this._contentElement);

    this._onMouseDown = this._onMouseDown.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseUp = this._onMouseUp.bind(this);

    this.element.addEventListener('mousedown', this._onMouseDown);
  }

  _coordinateToValue(event) {
    const delta = event.clientX - this._boundingRect.left;

    let value = delta < 0 ? 0 : delta;
    value = delta > this._boundingRect.width
      ? this._boundingRect.width : value;

    return value / this._boundingRect.width;
  }

  _onMouseDown(event) {
    if (event.target === this._handlerAreaElement
      || event.target === this._buttonElement
    ) {
      this._isInEditing = true;
      this._boundingRect = this._backgroundElement.getBoundingClientRect();

      const value = this._coordinateToValue(event);
      this._setValue(value);
      this._mouseDownHandler(value);

      document.addEventListener('mousemove', this._onMouseMove);
      document.addEventListener('mouseup', this._onMouseUp);
    }
  }

  _onMouseMove(event) {
    const value = this._coordinateToValue(event);
    this._setValue(value);
    this._mouseMoveHandler(value);
  }

  _onMouseUp(event) {
    document.removeEventListener('mousemove', this._onMouseMove);
    document.removeEventListener('mouseup', this._onMouseUp);

    const value = this._coordinateToValue(event);
    this._setValue(value);
    this._mouseUpHandler(value);

    delete this._boundingRect;
    this._isInEditing = false;
  }

  get element() {
    return this._element;
  }

  get value() {
    return this._value;
  }

  set value(value) {
    if (!this._isInEditing) this._setValue(value);
  }

  _setValue(value) {
    this._value = value;

    this._progressElement.style.setProperty(
      this.isVertical ? 'height' : 'width',
      `${value * 100}%`,
    );

    this._buttonElement.style.setProperty(
      this.isVertical ? 'bottom' : 'left',
      `${value * 100}%`,
    );
  }
}

export default PropgressBar;
