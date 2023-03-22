import { Player } from './player.js';
import {
  addGameboardToDOMForPlayer,
  addHiddenClassToElement,
  addEventlistenersToPlayerGameboard,
  showShipsOnGameboard,
  hideShipsOnGameboard,
  mutatePlayerGameboardAfterAttack,
  removeEventlistenersToPlayerGameboard,
  addShipTrackerToDOMForPlayer,
  createPlayerAreaInDOM,
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

  const player1GameboardHTML = player1.gameboard.createGameboardHTML(
    player1.name
  );
  const player1ShipTrackerHTML = player1.gameboard.createShipTrackingHTML(
    player1.name
  );
  createPlayerAreaInDOM(player1);
  addGameboardToDOMForPlayer(player1, player1GameboardHTML);
  addShipTrackerToDOMForPlayer(player1, player1ShipTrackerHTML);
  player1.placeShipsRandomly();
  showShipsOnGameboard(player1.gameboard.getAllShipCoords());

  const player2Gameboard = player2.gameboard.createGameboardHTML(player2.name);
  const player2ShipTrackerHTML = player2.gameboard.createShipTrackingHTML(
    player2.name
  );

  createPlayerAreaInDOM(player2);
  addGameboardToDOMForPlayer(player2, player2Gameboard);
  addShipTrackerToDOMForPlayer(player2, player1ShipTrackerHTML);
  player2.placeShipsRandomly();

  gameLoop();
}

function gameLoop() {
  takeTurns();
  addEventlistenersToPlayerGameboard(player2, humanShot);
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

function checkIfGameEnded() {
  if (player1.gameboard.areAllShipsSunk()) {
    console.log(`${player2.name} won!`);
    removeEventlistenersToPlayerGameboard(player2, humanShot);
  }
  if (player2.gameboard.areAllShipsSunk()) {
    console.log(`${player1.name} won!`);
    removeEventlistenersToPlayerGameboard(player2, humanShot);
  }
}

function humanShot(e, enemyPlayer) {
  const player = enemyPlayer === player1 ? player2 : player1;
  if (!player.isMyTurn) return;
  const shot = [
    Number(e.currentTarget.dataset.xCoord),
    Number(e.currentTarget.dataset.yCoord),
  ];
  const attackResult = player.attackEnemy(shot, enemyPlayer);
  if (attackResult === null) {
    console.log('Shot already taken');
    return;
  }
  mutatePlayerGameboardAfterAttack(enemyPlayer, shot, attackResult);
  checkIfGameEnded();
  takeTurns();
  setTimeout(() => {
    computerShot();
  }, Math.floor(Math.random() * 1000));
}

async function computerShot() {
  if (!player2.isComputer || !player2.isMyTurn) return;

  const computerShotData = player2.computerShot(player1);
  console.log({ compShot: computerShotData.nextShot });
  mutatePlayerGameboardAfterAttack(
    player1,
    computerShotData.nextShot,
    computerShotData.attackResponse
  );
  checkIfGameEnded();
  takeTurns();
}
