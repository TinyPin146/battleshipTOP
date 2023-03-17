import { Player } from './player.js';
import {
  addGameboardToDOMForPlayer,
  addHiddenClassToElement,
  addEventlistenersToPlayerGameboard,
  showShipsOnGameboard,
  hideShipsOnGameboard,
} from './index.js';

let player1 = null;
let player2 = null;

export function setUpPlayers(Player1, Player2, isPlayer2Computer) {
  let player2Name = Player2;
  if (!Player1 || (!Player2 && !isPlayer2Computer)) return;
  if (player1 !== null || player2 !== null) return;

  addHiddenClassToElement(document.querySelector('.gamestart-form'));

  if (isPlayer2Computer) player2Name = 'AI';
  player1 = new Player(Player1);
  player2 = new Player(player2Name, isPlayer2Computer);

  const player1Gameboard = player1.gameboard.createGameboardHTML(player1.name);
  addGameboardToDOMForPlayer(player1Gameboard);
  addEventlistenersToPlayerGameboard(player1.name);
  player1.gameboard.placeShip(5, player1.name, 'Carrier', [5, 5], 'X');
  showShipsOnGameboard(player1.gameboard.getAllShipCoords());

  const player2Gameboard = player2.gameboard.createGameboardHTML(player2.name);
  addGameboardToDOMForPlayer(player2Gameboard);
  addEventlistenersToPlayerGameboard(player2.name);
  player2.placeShipsRandomly();

  takeTurns();

  console.log({ player1, player2 });
}

function takeTurns() {
  if (player1.isMyTurn === null && player2.isMyTurn === null) {
    player1.isMyTurn = true;
    player2.isMyTurn = false;
  } else {
    player1.isMyTurn = !player1.isMyTurn;
    player2.isMyTurn = !player2.isMyTurn;
  }
}
