import { Player } from '../src/player.js';

let Player1;
let Player2;

beforeEach(() => {
  Player1 = new Player('Martin', false);
  Player2 = new Player('AI', true);
});

afterEach(() => {
  Player1 = null;
  Player2 = null;
});

describe('Player tests', () => {
  it('Checks is Player factoryFunc is existing', () => {
    expect(Player).toBeDefined();
  });

  it('Has an own gameboard', () => {
    expect(Player1).toHaveProperty('gameboard');
    expect(Player2).toHaveProperty('gameboard');
  });

  it('Can attack enemy ', () => {
    expect(Player1.attackEnemy).toBeDefined();

    Player2.gameboard.placeShip(5, null, 'Carrier', [5, 5], 'X');
    expect(Player1.attackEnemy([6, 6], Player2).isHit).toBe(false);
    expect(Player1.attackEnemy([5, 5], Player2).isHit).toBe(true);
  });

  it('AI can calculate shot', () => {
    createShots(Player1);
    expect(Player2.computerShot(Player1)).toHaveLength(2);
    expect(Player2.computerShot(Player1)[1]).toBe(10);
  });

  it('AI can track shots after hit', () => {
    Player1.gameboard.placeShip(5, 'Player1', 'Carrier', [5, 5], 'X');
    Player2.attackEnemy([5, 5], Player1);
    const compShot = Player2.computerShot(Player1);

    expect(compShot).toHaveLength(2);
  });

  it('should return next shot coordinates based on hit axis and hit direction', () => {
    const game = new Player();
    game.lastShotCoords = [2, 3];
    game.hitAxis = 'X';
    game.hitDirection = 'positive';
    expect(game.shotIfShipIsHitTwice()).toEqual([3, 3]);

    game.lastShotCoords = [5, 8];
    game.hitAxis = 'Y';
    game.hitDirection = 'negative';
    expect(game.shotIfShipIsHitTwice()).toEqual([5, 7]);
  });

  it('Can track ship if the direction and axis is determines', () => {
    Player2.didLastShotHit = true;
    Player2.lastShotCoords = [6, 5];
    Player2.hitAxis = 'X';
    Player2.hitDirection = 'positive';

    expect(Player2.computerShot(Player1)).toEqual([7, 5]);
  });

  it('Can track shots if its the end of a ship', () => {
    Player1.gameboard.placeShip(5, 'Player1', 'Carrier', [5, 5], 'X');

    Player2.attackEnemy([6, 5], Player1);
    Player2.attackEnemy([7, 5], Player1);
    Player2.attackEnemy([8, 5], Player1);
    Player2.didLastShotHit = true;
    Player2.lastShotCoords = [9, 5];
    Player2.firstHitCoords = [6, 5];
    Player2.hitAxis = 'X';
    Player2.hitDirection = 'positive';
    Player2.computerShot(Player1);

    console.log(Player2);
    expect(Player2.computerShot(Player1)).toEqual([5, 5]);
  });
});

function createShots(player) {
  const shots = [];
  for (let i = 1; i <= 10; i += 1) {
    for (let j = 1; j <= 9; j += 1) {
      shots.push([i, j]);
    }
  }
  shots.forEach((shot) => {
    player.gameboard.missedHits.push(shot);
  });
}
