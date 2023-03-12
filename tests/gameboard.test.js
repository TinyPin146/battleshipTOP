import { Gameboard } from '../src/gameboard.js';

let gameboard;
beforeEach(() => {
  gameboard = new Gameboard();
});

describe('Tests gameboard function', () => {
  it('Places a ship at defined coordinates', () => {
    expect(gameboard).toBeDefined();
    expect(gameboard).toHaveProperty('ships');
  });
  it('Creates a ship at given coords', () => {
    gameboard.placeShip(5, 'Player', 'Carrier', [5, 5], 'X');
    expect(gameboard.ships).toHaveLength(1);
    expect(gameboard.ships[0]).toHaveProperty('startCoordinates');
  });
  it('Decides if a ship was hit', () => {
    gameboard.placeShip(5, 'Player', 'Carrier', [5, 5], 'X');
    const attackResponse = gameboard.receiveAttack([5, 5]);
    expect(attackResponse).toBeDefined();
    expect(attackResponse).toBe(true);
    expect(gameboard.ships[0].numberOfHits).toBe(1);
  });
});
