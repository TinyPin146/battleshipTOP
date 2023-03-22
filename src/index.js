import { setUpPlayers } from './gameLoop.js';

const player1NameInput = document.querySelector('#player1');
const player2NameInput = document.querySelector('#player2');
const startGameWithAIBtn = document.querySelector('.start-game-AI-btn');
const startGameWithPlayerBtn = document.querySelector('.start-game-player-btn');
const PLAYER_AREA_CLASS_NAME = 'player-area-';

export function createPlayerAreaInDOM(player) {
  const playerAreaHTMLElement = document.createElement('div');
  playerAreaHTMLElement.classList.add(
    `${PLAYER_AREA_CLASS_NAME}${player.name}`,
    'player-area'
  );
  document
    .querySelector('main')
    .insertAdjacentElement('beforeend', playerAreaHTMLElement);
}

export function addGameboardToDOMForPlayer(player, gameboard) {
  document
    .querySelector(`.${PLAYER_AREA_CLASS_NAME}${player.name}`)
    .insertAdjacentElement('beforeend', gameboard);
}

export function addShipTrackerToDOMForPlayer(player, tracker) {
  document
    .querySelector(`.${PLAYER_AREA_CLASS_NAME}${player.name}`)
    .insertAdjacentHTML('beforeend', tracker);
}

export function trackSunkenShip(ship) {
  console.log(ship.id);
  document.querySelector(`.${ship.id}`).classList.add('ship-sunken');
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

export function removeEventlistenersToPlayerGameboard() {
  const oldBody = document.body;
  const newBody = oldBody.cloneNode(true);
  oldBody.parentNode.replaceChild(newBody, oldBody);
}

export function showShipsOnGameboard(player) {
  const playerGameArea = document.querySelector(
    `.${PLAYER_AREA_CLASS_NAME}${player.name}`
  );
  player.gameboard.getAllShipCoords().forEach((shipCoords) => {
    shipCoords.forEach((coord) => {
      const shipElementGrid = playerGameArea.querySelector(
        `[data-x-coord="${coord[0]}"][data-y-coord="${coord[1]}"]`
      );
      shipElementGrid.classList.remove('ship-hidden');
      shipElementGrid.classList.add('ship-shown');
    });
  });
}

export function hideShipsOnGameboard(player) {
  const playerGameArea = document.querySelector(
    `.${PLAYER_AREA_CLASS_NAME}${player.name}`
  );

  player.gameboard.getAllShipCoords().forEach((shipCoords) => {
    shipCoords.forEach((coord) => {
      const shipElementGrid = playerGameArea.querySelector(
        `[data-x-coord="${coord[0]}"][data-y-coord="${coord[1]}"]`
      );
      shipElementGrid.classList.remove('ship-shown');
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

export function showEndOfGameScreen(winner) {
  const endGAmeModal = document.querySelector('.end-game-modal');
  endGAmeModal.classList.toggle('hidden');

  endGAmeModal.querySelector(
    '.end-game-menu > h2'
  ).textContent = `The winner is ${winner}`;

  document.querySelector('.play-again-btn').addEventListener('click', () => {
    endGAmeModal.classList.toggle('hidden');
    clearGameboards();
    document.querySelector('.gamestart-form').classList.toggle('hidden');
    const isOpponentAI = !player2NameInput.value;
    setUpPlayers(player1NameInput.value, player2NameInput.value, isOpponentAI);
  });

  document
    .querySelector('.play-again-with-other-players')
    .addEventListener('click', () => {
      endGAmeModal.classList.toggle('hidden');
      clearGameboards();
      document.querySelector('.gamestart-form').classList.toggle('hidden');
      document
        .querySelector('.start-game-AI-btn')
        .addEventListener('click', () => {
          const isOpponentAI = !player2NameInput.value;
          setUpPlayers(
            player1NameInput.value,
            player2NameInput.value,
            isOpponentAI
          );
        });
    });
}

function clearGameboards() {
  const gameboards = document.querySelectorAll('.player-area');
  gameboards.forEach((gameboard) => {
    gameboard.parentElement.removeChild(gameboard);
  });
}

export function addHiddenClassToElement(element) {
  element.classList.add('hidden');
}

startGameWithAIBtn.addEventListener('click', () => {
  const isOpponentAI = !player2NameInput.value;
  setUpPlayers(player1NameInput.value, player2NameInput.value, isOpponentAI);
});

startGameWithPlayerBtn.addEventListener('click', () => {
  const isOpponentAI = !player2NameInput.value;
  setUpPlayers(player1NameInput.value, player2NameInput.value, isOpponentAI);
});
