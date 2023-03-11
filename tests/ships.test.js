import { Ship } from '../src/ships.js';

describe('Ship test', () => {
  it('Tests if a ship is correctly created', () => {
    expect(Ship(5)).toHaveProperty('length');
    expect(Ship(5).length).toBe(5);
    const ship = Ship(5);
    ship.hit();
    expect(ship.numberOfHits).toBe(1);

    expect(ship.isSunk()).toBe(false);
    ship.numberOfHits = 5;
    expect(ship.isSunk()).toBe(true);
  });
});
