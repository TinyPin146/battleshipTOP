import { Ship } from '../src/ships.js';

let ship;
beforeEach(() => {
  ship = new Ship(5, 'Player', 'Carrier');
});

describe('Ship test', () => {
  it('Tests if a ship is correctly created', () => {
    expect(ship).toHaveProperty('length');
    expect(ship).toHaveProperty('team');
    expect(ship).toHaveProperty('type');
    expect(ship.length).toBe(5);
    expect(ship.team).toEqual('Player');
    expect(ship.type).toEqual('Carrier');
  });

  it('Tests if the number of hits method increments the hit count', () => {
    ship.hit();
    expect(ship.numberOfHits).toBe(1);
  });

  it('Tests if the isSunk method returns the correct value based on hits', () => {
    expect(ship.isSunk()).toBe(false);
    ship.numberOfHits = 5;
    expect(ship.isSunk()).toBe(true);
  });
});
