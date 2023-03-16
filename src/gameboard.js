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
      let isHit = false;
      let didSink = null;
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
            break;
          }
        }
      });
      this.missedHits.push(attackCoords);
      return { isHit, didSink };
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
          gameboardElement.setAttribute('data-X-coord', i);
          gameboardElement.setAttribute('data-Y-coord', j);
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
  };
}
