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
  showEndOfGameScreen,
  updateNarrationArea,
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
  const player2Gameboard = player2.gameboard.createGameboardHTML(player2.name);
  const player2ShipTrackerHTML = player2.gameboard.createShipTrackingHTML(
    player2.name
  );

  createPlayerAreaInDOM(player1);
  addGameboardToDOMForPlayer(player1, player1GameboardHTML);
  addShipTrackerToDOMForPlayer(player1, player1ShipTrackerHTML);

  createPlayerAreaInDOM(player2);
  addGameboardToDOMForPlayer(player2, player2Gameboard);
  addShipTrackerToDOMForPlayer(player2, player2ShipTrackerHTML);

  if (isPlayer2Computer) player2.placeShipsRandomly();
}

export function startGameLoop() {
  if (
    player1.gameboard.ships.length === 5 &&
    player2.gameboard.ships.length === 5
  ) {
    gameLoop();
    return true;
  }
  return false;
}

function gameLoop() {
  takeTurns();
  if (player2.isComputer) {
    addEventlistenersToPlayerGameboard(player2, humanShot);
  } else {
    addEventlistenersToPlayerGameboard(player2, humanShot);
    addEventlistenersToPlayerGameboard(player1, humanShot);
  }
}

function takeTurns() {
  if (!player1 || !player2) return;
  if (player1.isMyTurn === null && player2.isMyTurn === null) {
    player1.isMyTurn = true;
    player2.isMyTurn = false;
  } else {
    player1.isMyTurn = !player1.isMyTurn;
    player2.isMyTurn = !player2.isMyTurn;
  }
  if (!player1.isComputer && !player2.isComputer) {
    if (player1.isMyTurn) {
      hideShipsOnGameboard(player2);
      setTimeout(() => {
        showShipsOnGameboard(player1);
      }, 2000);
    }
    if (player2.isMyTurn) {
      hideShipsOnGameboard(player1);
      setTimeout(() => {
        showShipsOnGameboard(player2);
      }, 2000);
    }
  }
  if (player2.isComputer) {
    showShipsOnGameboard(player1);
  }

  const playerHasTurn = player1.isMyTurn ? player1 : player2;
  setTimeout(() => {
    updateNarrationArea(`${playerHasTurn.name} is aiming...`);
  }, 0);
}

function checkIfGameEnded() {
  if (player1.gameboard.areAllShipsSunk()) {
    removeEventlistenersToPlayerGameboard(player2, humanShot);
    showEndOfGameScreen(player2.name);
  }
  if (player2.gameboard.areAllShipsSunk()) {
    removeEventlistenersToPlayerGameboard(player2, humanShot);
    showEndOfGameScreen(player1.name);
  }
  if (
    player1.gameboard.areAllShipsSunk() ||
    player2.gameboard.areAllShipsSunk()
  ) {
    player1 = null;
    player2 = null;
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
    return;
  }
  mutatePlayerGameboardAfterAttack(enemyPlayer, shot, attackResult);
  checkIfGameEnded();
  takeTurns();
  if (player2.isComputer) {
    setTimeout(() => {
      computerShot();
    }, Math.floor(Math.random() * 750));
  }
}

async function computerShot() {
  if (!player2 || !player2.isComputer || !player2.isMyTurn) return;

  const computerShotData = player2.computerShot(player1);
  mutatePlayerGameboardAfterAttack(
    player1,
    computerShotData.nextShot,
    computerShotData.attackResponse
  );
  checkIfGameEnded();
  takeTurns();
}
