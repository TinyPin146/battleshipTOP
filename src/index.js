import { Player } from './player.js';
import { Gameboard } from './gameboard.js';
import { Ship } from './ships.js';

const Player1 = new Player('Martin');
const Player2 = new Player('AI', true);

Player1.gameboard.placeShip(5, 'Player', 'Carrier', [5, 5], 'X');
Player1.gameboard.placeShip(5, 'Player', 'Carrier', [2, 2], 'Y');
