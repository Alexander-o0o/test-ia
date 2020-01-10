/* eslint-disable import/extensions */
import Player from './player.js';

const TRACK_URL = 'https://upload.wikimedia.org/wikipedia/commons/3/3c/01_-_Vivaldi_Spring_mvt_1_Allegro_-_John_Harrison_violin.ogg';

const playerA = new Player(TRACK_URL);

document.body.append(playerA.element);
