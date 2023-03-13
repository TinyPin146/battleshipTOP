import { Player } from '../src/player.js';

let Player1;
let Player2;

beforeEach(() => {
  Player1 = new Player('Martin', false);
  Player2 = new Player('AI', true);
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
    expect(Player1.attackEnemy([6, 6], Player2)).toBe(false);
    expect(Player1.attackEnemy([5, 5], Player2)).toBe(true);
  });

  it('AI can calculate shot', () => {
    createShots(Player1);
    expect(Player2.computerShot(Player1)).toHaveLength(2);
    expect(Player2.computerShot(Player1)[1]).toBe(10);
  });
});

function createShots(Player) {
  const shots = [];
  for (let i = 1; i <= 10; i++) {
    for (let j = 1; j <= 9; j++) {
      shots.push([i, j]);
    }
  }
  shots.forEach((shot) => {
    Player.gameboard.missedHits.push(shot);
  });
}
