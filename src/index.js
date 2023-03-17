import { setUpPlayers } from './gameLoop.js';

const player1NameInput = document.querySelector('#player1');
const player2NameInput = document.querySelector('#player2');
const startGameWithAIBtn = document.querySelector('.start-game-AI-btn');
const startGameWithPlayerBtn = document.querySelector('.start-game-player-btn');

export function addGameboardToDOMForPlayer(gameboard) {
  document.querySelector('main').insertAdjacentElement('beforeend', gameboard);
}

export function addEventlistenersToPlayerGameboard(player) {
  document
    .querySelectorAll(`.gameboard-element-${player}`)
    .forEach((element) => {
      element.addEventListener('click', (e) => {
        console.log([
          Number(e.currentTarget.dataset.xCoord),
          Number(e.currentTarget.dataset.yCoord),
        ]);
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

export function addHiddenClassToElement(element) {
  element.classList.add('hidden');
}

startGameWithAIBtn.addEventListener('click', () => {
  setUpPlayers(player1NameInput.value, player2NameInput.value, true);
});
