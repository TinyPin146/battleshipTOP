import { setUpPlayers } from './gameLoop.js';

const player1NameInput = document.querySelector('#player1');
const player2NameInput = document.querySelector('#player2');
const startGameWithAIBtn = document.querySelector('.start-game-AI-btn');
const startGameWithPlayerBtn = document.querySelector('.start-game-player-btn');

export function addGameboardToDOMForPlayer(gameboard) {
  document.querySelector('main').insertAdjacentElement('beforeend', gameboard);
}

export function addEventlistenersToPlayerGameboard(player, func) {
  document
    .querySelectorAll(`.gameboard-element-${player.name}`)
    .forEach((element) => {
      element.addEventListener('click', (e) => {
        func(e, player);
      });
    });
}

export function showShipsOnGameboard(allShipCoords) {
  allShipCoords.forEach((shipCoords) => {
    shipCoords.forEach((coord) => {
      const shipElementGrid = document.querySelector(
        `[data-x-coord="${coord[0]}"][data-y-coord="${coord[1]}"]`
      );
      shipElementGrid.classList.add('ship-shown');
    });
  });
}

export function hideShipsOnGameboard(allShipCoords) {
  allShipCoords.forEach((shipCoords) => {
    shipCoords.forEach((coord) => {
      const shipElementGrid = document.querySelector(
        `[data-x-coord="${coord[0]}"][data-y-coord="${coord[1]}"]`
      );
      shipElementGrid.classList.add('ship-hidden');
    });
  });
}

export function mutatePlayerGameboardAfterAttack(player, shot, attackResult) {
  const gameboard = document.querySelector(`.gameboard-parent-${player.name}`);
  const attackedGridElement = gameboard.querySelector(
    `[data-x-coord="${shot[0]}"][data-y-coord="${shot[1]}"]`
  );

  if (attackResult.isHit) {
    attackedGridElement.textContent = 'X';
  } else {
    attackedGridElement.style.background = 'red';
  }
}

export function addHiddenClassToElement(element) {
  element.classList.add('hidden');
}

startGameWithAIBtn.addEventListener('click', () => {
  setUpPlayers(player1NameInput.value, player2NameInput.value, true);
});
