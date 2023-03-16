import { Player } from './player.js';
import {
  addGameboardToDOMForPlayer,
  addHiddenClassToElement,
  addEventlistenersToPlayerGameboard,
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

  const player2Gameboard = player2.gameboard.createGameboardHTML(player2.name);
  addGameboardToDOMForPlayer(player2Gameboard);
  addEventlistenersToPlayerGameboard(player2.name);

  console.log({ player1, player2 });
}
