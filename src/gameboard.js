import { Ship } from './ships.js';

export function Gameboard() {
  return {
    ships: [],
    placeShip(length, team, type, coordinates, axis) {
      this.ships.push(new Ship(length, team, type, coordinates, axis));
    },
    receiveAttack(attackCoords) {
      let isHit = false;
      this.ships.forEach((ship) => {
        const shipCoords = this.getShipCoords(ship);
        for (let i = 0; i < shipCoords.length; i += 1) {
          if (
            shipCoords[i][0] === attackCoords[0] &&
            shipCoords[i][1] === attackCoords[1]
          ) {
            ship.hit();
            isHit = true;
            break;
          }
        }
      });
      return isHit;
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
  };
}

/* Gameboards should have a receiveAttack function that takes a pair of coordinates, determines whether or not the attack hit a
 ship and then sends the ‘hit’ function to the correct ship, or records the coordinates of the missed shot. */
