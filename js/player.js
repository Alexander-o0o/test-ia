/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
import PropgressBar from './progressBar.js';
import ToggleButton from './toggleButton.js';
import Button from './button.js';
import Menu from './menu.js';
import { secToTimestr, saveWithBlob } from './utils.js';

function createAudioElement({
  trackUrl, onLoadedData, onTimeUpdate, onEnded,
}) {
  const elment = document.createElement('audio');
  elment.setAttribute('src', trackUrl);
  elment.addEventListener('loadeddata', onLoadedData);
  elment.addEventListener('timeupdate', onTimeUpdate);
  elment.addEventListener('ended', onEnded);
  return elment;
}

function createTitleElement({ text }) {
  const element = document.createElement('div');
  element.classList.add('player__title');
  element.innerHTML = text;

  return element;
}

function createPlaybackToggleButton({ play, pause }) {
  const playIconElement = document.createElement('i');
  playIconElement.classList.add('icon', 'play-icon');

  const pauseIconElement = document.createElement('i');
  pauseIconElement.classList.add('icon', 'pause-icon');

  const toggleButton = new ToggleButton({
    clickHandlers: [
      () => {
        toggleButton.setIcon(pauseIconElement);
        play();
      },
      () => {
        toggleButton.setIcon(playIconElement);
        pause();
      },
    ],
    iconElement: playIconElement,
  });

  toggleButton.element.classList.add(
    'player__playback-button',
    'player-button',
  );
  return toggleButton;
}

function createPlaybackRateMenu({ setPlaybackRate, initialRate }) {
  const menu = new Menu({
    text: `x${initialRate}`,
    buttonClass: 'player-button',
    itemsClass: 'player-rate-options',
    position: Menu.position.RIGHT,
  });

  const createItemElement = (value) => {
    const element = document.createElement('div');
    element.innerHTML = value;
    element.classList.add('player-rate-option');

    element.addEventListener('click', () => {
      menu.text = `x${value}`;
      setPlaybackRate(value);
    });

    return element;
  };

  menu.addItem(createItemElement(0.5));
  menu.addItem(createItemElement(1));
  menu.addItem(createItemElement(1.25));
  menu.addItem(createItemElement(1.5));
  menu.addItem(createItemElement(1.75));
  menu.addItem(createItemElement(2));
  menu.addItem(createItemElement(2.25));

  menu.element.classList.add('player__rate-menu');
  return menu;
}

function createVolumeMenu({ setVolume, initialVolume }) {
  const progressBar = new PropgressBar({
    mouseDownHandler: setVolume,
    mouseMoveHandler: setVolume,
    mouseUpHandler: setVolume,
  });

  progressBar.value = initialVolume;

  const element = document.createElement('div');
  element.classList.add('player-volume-progress');
  element.append(progressBar.element);

  const iconElement = document.createElement('i');
  iconElement.classList.add('icon', 'volume-icon');

  const menu = new Menu({
    iconElement,
    buttonClass: 'player-button',
    position: Menu.position.RIGHT,
    hideOnClick: false,
  });
  menu.addItem(element);

  menu.element.classList.add('player__volume-menu');
  return menu;
}

function createSaveButton({ trackUrl, filename }) {
  const iconElement = document.createElement('i');
  iconElement.classList.add('icon', 'download-icon');

  const button = new Button({ iconElement });

  button.element.addEventListener('click', () => {
    saveWithBlob(trackUrl, filename);
  });

  button.element.classList.add(
    'player__save-button',
    'player-button',
  );
  return button;
}

function createOpenButton() {
  const iconElement = document.createElement('i');
  iconElement.classList.add('icon', 'upload-icon');

  const button = new Button({ iconElement });

  button.element.classList.add(
    'player__open-button',
    'player-button',
  );
  return button;
}

class Player {
  constructor(trackUrl) {
    const filename = trackUrl.slice(trackUrl.lastIndexOf('/') + 1);

    // bindings
    this._updateTimeLabels = this._updateTimeLabels.bind(this);
    this._onAudioLoadedData = this._onAudioLoadedData.bind(this);
    this._onAudioTimeUpdate = this._onAudioTimeUpdate.bind(this);
    this._play = this._play.bind(this);
    this._pause = this._pause.bind(this);
    this._setVolume = this._setVolume.bind(this);
    this._setPlaybackRate = this._setPlaybackRate.bind(this);

    // simple controls
    this._audioElement = createAudioElement({
      trackUrl,
      onLoadedData: this._onAudioLoadedData,
      onTimeUpdate: this._onAudioTimeUpdate,
      onEnded: () => { this._playbackToggleButton.element.click(); },
    });

    // complex controls
    this._playbackToggleButton = createPlaybackToggleButton({
      play: this._play,
      pause: this._pause,
    });

    this._playbackProgressBar = new PropgressBar({
      mouseDownHandler: this._updateTimeLabels,
      mouseMoveHandler: this._updateTimeLabels,
      mouseUpHandler: (value) => {
        this._audioElement.currentTime = this._audioElement.duration * value;
      },
    });

    this._playbackRateMenu = createPlaybackRateMenu({
      setPlaybackRate: this._setPlaybackRate,
      initialRate: this._audioElement.playbackRate,
    });

    this._volumeMenu = createVolumeMenu({
      setVolume: this._setVolume,
      initialVolume: this._audioElement.volume,
    });

    this._saveTrackButton = createSaveButton({ trackUrl, filename });
    this._openTrackButton = createOpenButton();

    // simplest elements
    this._trackTitleElement = createTitleElement({ text: filename });
    this._trackTitleElement.classList.add('player__title');

    this._timeLabelElement = document.createElement('span');
    this._timeLabelElement.classList.add('player__time');

    this._countDownTimeLabelElement = document.createElement('span');
    this._countDownTimeLabelElement.classList.add('player__countdown-time');

    // composite elements
    this._playbackProgressElement = document.createElement('span');
    this._playbackProgressElement.classList.add('player__propgress-bar');
    this._playbackProgressElement.append(this._playbackProgressBar.element);

    this._contentElement = document.createElement('div');
    this._contentElement.classList.add('player__content');
    this._contentElement.append(
      this._playbackToggleButton.element,
      this._timeLabelElement,
      this._playbackProgressElement,
      this._countDownTimeLabelElement,
      this._playbackRateMenu.element,
      this._volumeMenu.element,
      this._saveTrackButton.element,
      this._openTrackButton.element,
      this._audioElement,
    );

    // root element
    this._element = document.createElement('div');
    this._element.classList.add('player');
    this._element.append(
      this._trackTitleElement,
      this._contentElement,
    );
  }

  get element() {
    return this._element;
  }

  _onAudioLoadedData() {
    const duration = Math.floor(this._audioElement.duration);
    this._timeLabelElement.innerHTML = secToTimestr(0);
    this._countDownTimeLabelElement.innerHTML = secToTimestr(duration);
  }

  _onAudioTimeUpdate(event) {
    const value = event.target.currentTime / event.target.duration;
    const valuePrev = this._playbackProgressBar.value;

    const rounding = 1000;
    const rounded = Math.round(value * rounding);
    const roundedPrev = Math.round(valuePrev * rounding);

    if (Math.abs(rounded - roundedPrev) > 0 || roundedPrev === rounding) {
      this._playbackProgressBar.value = value;
      this._updateTimeLabels(value);
    }
  }

  _updateTimeLabels(value) {
    const duration = Math.floor(this._audioElement.duration);
    const time = Math.floor(this._audioElement.duration * value);
    const countDownTime = duration - time;

    if (time !== this._prevTime) {
      this._timeLabelElement.innerHTML = secToTimestr(time);
      this._countDownTimeLabelElement.innerHTML = secToTimestr(countDownTime);
    }
    this._prevTime = time;
  }

  _play() {
    this._audioElement.play();
  }

  _pause() {
    this._audioElement.pause();
  }

  _setCurrentTime(seconds) {
    this._audioElement.currentTime = seconds;
  }

  _setVolume(value) {
    this._audioElement.volume = value;
  }

  _setPlaybackRate(value) {
    this._audioElement.playbackRate = value;
  }
}

export default Player;
