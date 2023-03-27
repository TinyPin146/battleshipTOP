import { setUpPlayers, startGameLoop } from './gameLoop.js';

const player1NameInput = document.querySelector('#player1');
const player2NameInput = document.querySelector('#player2');
const startGameWithAIBtn = document.querySelector('.start-game-AI-btn');
const startGameWithPlayerBtn = document.querySelector('.start-game-player-btn');
const PLAYER_AREA_CLASS_NAME = 'player-area-';

export function createPlayerAreaInDOM(player) {
  const main = document.querySelector('main');
  const playerAreaHTMLElement = document.createElement('div');
  playerAreaHTMLElement.classList.add(
    `${PLAYER_AREA_CLASS_NAME}${player.name}`,
    'player-area'
  );
  const playerId = document.createElement('h2');
  playerId.textContent = `${player.name}`;
  playerAreaHTMLElement.insertAdjacentElement('afterbegin', playerId);

  const axisBtn = document.createElement('button');
  axisBtn.setAttribute('data-axis', 'X');
  axisBtn.classList.add('axis-selector-btn', 'button', 'center');
  axisBtn.textContent = 'Axis: X';

  if (!document.querySelector('.axis-selector-btn')) {
    main.insertAdjacentElement('afterbegin', axisBtn);
  }
  axisBtn.addEventListener('click', setAxis);
  main.insertAdjacentElement('beforeend', playerAreaHTMLElement);
}

export function addGameboardToDOMForPlayer(player, gameboard) {
  document
    .querySelector(`.${PLAYER_AREA_CLASS_NAME}${player.name}`)
    .insertAdjacentElement('beforeend', gameboard);
}

export function addShipTrackerToDOMForPlayer(player, tracker) {
  const playerArea = document.querySelector(
    `.${PLAYER_AREA_CLASS_NAME}${player.name}`
  );
  playerArea.insertAdjacentHTML('beforeend', tracker);

  const gameboardGrids = playerArea.querySelectorAll('.gameboard-element');
  const shipDraggables = playerArea.querySelectorAll('.draggable');

  shipDraggables.forEach((draggable) => {
    draggable.addEventListener('dragstart', shipDragStart);
  });
  shipDraggables.forEach((draggable) => {
    draggable.addEventListener('dragend', shipDragEnd);
  });

  gameboardGrids.forEach((grid) => {
    grid.addEventListener('dragover', (e) => {
      e.preventDefault();
    });
  });
  gameboardGrids.forEach((grid) => {
    grid.addEventListener('drop', (e) => {
      dropOnGrid(e, player);
    });
  });
}

function shipDragStart(e) {
  // !
  this.classList.toggle('hold');
  requestAnimationFrame(() => {
    this.classList.toggle('hidden');
  });
  e.dataTransfer.setData('shipLength', this.dataset.length);
  e.dataTransfer.setData('shipType', this.dataset.shiptype);
  e.dataTransfer.setData('shipElem', this);
}

function shipDragEnd(e) {
  // !
  console.log(e);
  this.classList.toggle('hold');
  this.classList.toggle('hidden');
}

function dropOnGrid(e, player) {
  const shipLength = Number(e.dataTransfer.getData('shipLength'));
  const shiptType = e.dataTransfer.getData('shipType');
  const axisBtn = document.querySelector('.axis-selector-btn');
  const { axis } = axisBtn.dataset;
  const shipListItemElem = document.querySelector(
    `.${shiptType.toLowerCase()}-${player.name}`
  );
  let xCoord = Number(e.currentTarget.dataset.xCoord);
  let yCoord = Number(e.currentTarget.dataset.yCoord);

  if (axis === 'X' && xCoord + shipLength > 10) {
    xCoord = 10 - shipLength + 1;
  }
  if (axis === 'Y' && yCoord + shipLength > 10) {
    yCoord = 10 - shipLength + 1;
  }

  if (
    player.gameboard.determineIfShipIsOnAnotherShip(
      shipLength,
      [xCoord, yCoord],
      axis
    )
  )
    return;

  player.gameboard.placeShip(
    shipLength,
    player.name,
    shiptType,
    [xCoord, yCoord],
    axis
  );

  if (player.gameboard.checkIfPlayerHasTypeOfShip(shiptType)) {
    setTimeout(() => {
      shipListItemElem.querySelector('div').classList.add('hidden');
    }, 0);
  }
  showShipsOnGameboard(player);
  console.log(shipListItemElem.querySelector('div'));
  const didGameStart = startGameLoop();

  if (didGameStart) {
    const narrationArea = document.createElement('div');
    narrationArea.classList.add('narration-area');
    axisBtn.parentElement.removeChild(axisBtn);
    document
      .querySelector('main')
      .insertAdjacentElement('afterbegin', narrationArea);
  }
}

export function updateNarrationArea(text) {
  const narrationArea = document.querySelector('.narration-area');
  if (!narrationArea) return;

  narrationArea.textContent = '';
  narrationArea.textContent = text;
}

function setAxis() {
  const { axis } = this.dataset;

  if (axis === 'X') {
    this.textContent = 'Axis: Y';
    this.dataset.axis = 'Y';
  }

  if (axis === 'Y') {
    this.textContent = 'Axis: X';
    this.dataset.axis = 'X';
  }
}

export function trackSunkenShip(ship) {
  const sunkenShip = document.querySelector(`.${ship.id}`);
  sunkenShip.classList.add('ship-sunken');
  sunkenShip.style.color = 'red';
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

  const narrationArea = document.querySelector('.narration-area');
  narrationArea.parentElement.removeChild(narrationArea);
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
