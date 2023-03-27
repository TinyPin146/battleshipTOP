import { trackSunkenShip } from './index.js';
import { Ship } from './ships.js';

export function Gameboard() {
  return {
    ships: [],
    missedHits: [],
    areAllShipsSunk() {
      const statusOfShips = [];
      this.ships.forEach((ship) => {
        statusOfShips.push(ship.isSunk());
      });
      return statusOfShips.every((status) => status === true);
    },
    placeShip(length, team, type, coordinates, axis) {
      this.ships.push(new Ship(length, team, type, coordinates, axis));
    },
    receiveAttack(attackCoords) {
      if (this.determineIfArrayIsInArrayOfArrays(attackCoords, this.missedHits))
        return null;
      let isHit = false;
      let didSink = null;
      let instShip = null;
      this.ships.forEach((ship) => {
        const shipCoords = this.getShipCoords(ship);
        for (let i = 0; i < shipCoords.length; i += 1) {
          if (
            shipCoords[i][0] === attackCoords[0] &&
            shipCoords[i][1] === attackCoords[1]
          ) {
            ship.hit();
            isHit = true;
            didSink = ship.isSunk();
            instShip = ship;
            break;
          }
        }
      });
      this.missedHits.push(attackCoords);
      if (didSink) trackSunkenShip(instShip);
      return { isHit, didSink };
    },

    getAllShipCoords() {
      const allShipsCoords = [];
      this.ships.forEach((ship) => {
        const shipCoords = this.getShipCoords(ship);
        allShipsCoords.push(shipCoords);
      });
      return allShipsCoords;
    },
    getShipCoords(ship) {
      const shipCoords = [];
      for (let i = 0; i < ship.length; i += 1) {
        if (ship.axis === 'X') {
          shipCoords.push([
            ship.startCoordinates[0] + i,
            ship.startCoordinates[1],
          ]);
        } else {
          shipCoords.push([
            ship.startCoordinates[0],
            ship.startCoordinates[1] + i,
          ]);
        }
      }
      return shipCoords;
    },
    determineIfShipIsOnGameboard(length, startCoord, axis) {
      let isShipOnBoard = true;
      const shipCoords = this.getAShipsCoordinates(length, startCoord, axis);
      shipCoords.forEach((coord) => {
        if (coord[0] > 10 || coord[0] < 1 || coord[1] > 10 || coord[1] < 1) {
          isShipOnBoard = false;
        }
      });
      return isShipOnBoard;
    },
    determineIfShipIsOnAnotherShip(length, startCoord, axis) {
      let isShipOnAnotherShip = false;
      const shipCoords = this.getAShipsCoordinates(length, startCoord, axis);
      const createdShipCoords = this.getAllShipCoords().flat();

      for (let i = 0; i < shipCoords.length; i += 1) {
        for (let j = 0; j < createdShipCoords.length; j += 1) {
          if (
            (shipCoords[i][0] === createdShipCoords[j][0] &&
              shipCoords[i][1] === createdShipCoords[j][1]) ||
            (shipCoords[i][0] === createdShipCoords[j][0] + 1 &&
              shipCoords[i][1] === createdShipCoords[j][1]) ||
            (shipCoords[i][0] === createdShipCoords[j][0] - 1 &&
              shipCoords[i][1] === createdShipCoords[j][1]) ||
            (shipCoords[i][0] === createdShipCoords[j][0] &&
              shipCoords[i][1] === createdShipCoords[j][1] + 1) ||
            (shipCoords[i][0] === createdShipCoords[j][0] &&
              shipCoords[i][1] === createdShipCoords[j][1] - 1)
          ) {
            isShipOnAnotherShip = true;
            break;
          }
        }
      }
      return isShipOnAnotherShip;
    },
    getAShipsCoordinates(length, startCoord, axis) {
      const shipCoords = [];
      for (let i = 0; i <= length; i += 1) {
        if (axis === 'X') {
          shipCoords.push([startCoord[0] + i, startCoord[1]]);
        } else {
          shipCoords.push([startCoord[0], startCoord[1] + i]);
        }
      }
      return shipCoords;
    },
    determineIfArrayIsInArrayOfArrays(inputArr, arr) {
      let inputArrIsInArr = false;
      arr.forEach((value) => {
        if (value[0] === inputArr[0] && value[1] === inputArr[1])
          inputArrIsInArr = !inputArrIsInArr;
      });
      return inputArrIsInArr;
    },
    createGameboardHTML(name, height = 10, width = 10) {
      const gameboardParent = document.createElement('div');
      gameboardParent.classList.add(
        `gameboard-parent-${name}`,
        'gameboard-parent'
      );

      for (let i = 10; i >= height - (height - 1); i -= 1) {
        for (let j = 1; j <= width; j += 1) {
          const gameboardElement = document.createElement('div');
          gameboardElement.classList.add(
            'gameboard-element',
            `gameboard-element-${name}`
          );
          gameboardElement.setAttribute('data-X-coord', j);
          gameboardElement.setAttribute('data-Y-coord', i);
          if (i === 1) {
            gameboardElement.classList.add('gameboard-element-bottom-row');
          }
          if (j === 10) {
            gameboardElement.classList.add('gameboard-element-right-row');
          }
          gameboardParent.insertAdjacentElement('beforeend', gameboardElement);
        }
      }
      return gameboardParent;
    },

    createShipTrackingHTML(name) {
      if (name === 'AI') {
        return `
        <ul class="ship-tracking ship-tracking-${name}">
        <li class="ship carrier carrier-${name}">Carrier     
        </li>
        <li class="ship battleship battleship-${name}">Battleship
        </li>
        <li class="ship cruiser cruiser-${name}">Cruiser
        </li>
        <li class="ship submarine submarine-${name}">Submarine
        </li>
        <li class="ship destroyer destroyer-${name}">Destroyer
        </li>
      </ul>

        `;
      }
      return `
        <ul class="ship-tracking ship-tracking-${name}">
          <li class="ship carrier carrier-${name}">Carrier     
            <div class="draggable carrier-draggable" data-length="5" data-shipType="Carrier" draggable="true">
              <div class="ship-block ship-shown"></div>
              <div class="ship-block ship-shown"></div>
              <div class="ship-block ship-shown"></div>
              <div class="ship-block ship-shown"></div>
              <div class="ship-block ship-shown"></div>
            </div>
          </li>
          <li class="ship battleship battleship-${name}">Battleship
            <div class="draggable battleship-draggable" data-length="4" data-shipType="Battleship" draggable="true">
              <div class="ship-block ship-shown"></div>
              <div class="ship-block ship-shown"></div>
              <div class="ship-block ship-shown"></div>
              <div class="ship-block ship-shown"></div>
            </div>
          </li>
          <li class="ship cruiser cruiser-${name}">Cruiser
            <div class="draggable cruiser-draggable" data-length="3" data-shipType="Cruiser" draggable="true">
              <div class="ship-block ship-shown"></div>
              <div class="ship-block ship-shown"></div>
              <div class="ship-block ship-shown"></div>
            </div>
          </li>
          <li class="ship submarine submarine-${name}">Submarine
            <div class="draggable submarine-draggable" data-length="3" data-shipType="Submarine" draggable="true">
              <div class="ship-block ship-shown"></div>
              <div class="ship-block ship-shown"></div>
              <div class="ship-block ship-shown"></div>
            </div>
          </li>
          <li class="ship destroyer destroyer-${name}">Destroyer
            <div class="draggable destroyer-draggable" data-length="2" data-shipType="Destroyer" draggable="true">
              <div class="ship-block ship-shown"></div>
              <div class="ship-block ship-shown"></div>
            </div>
          </li>
        </ul>
      `;
    },
  };
}
