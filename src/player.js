import { Gameboard } from './gameboard.js';

export function Player(name, isComputer) {
  return {
    name,
    isComputer,
    didLastShotHit: false,
    lastShotCoords: null,
    isMyTurn: null,
    gameboard: new Gameboard(),

    attackEnemy(attackCoords, enemyPlayer) {
      if (enemyPlayer.gameboard.receiveAttack(attackCoords)) {
        this.didLastShotHit = true;
      } else {
        this.didLastShotHit = false;
      }
      this.lastShotCoords = attackCoords;
      return this.didLastShotHit;
    },

    computerShot(enemyPlayer) {
      if (!this.isComputer) return;
      let nextShot = calculateNextShotCoords();
      if (!this.didLastShotHit) {
        while (isNextShotAlreadyDone(nextShot)) {
          nextShot = calculateNextShotCoords();
        }
        return nextShot;
        // this.attackEnemy(nextShot, enemyPlayer);
      }

      function calculateNextShotCoords() {
        return [getRandomNumBetween1And10(), getRandomNumBetween1And10()];
      }
      function isNextShotAlreadyDone(shotCoords) {
        let isShotAlreadyDone = false;
        for (let i = 0; i < enemyPlayer.gameboard.missedHits.length; i += 1) {
          if (
            enemyPlayer.gameboard.missedHits[i][0] === shotCoords[0] &&
            enemyPlayer.gameboard.missedHits[i][1] === shotCoords[1]
          ) {
            isShotAlreadyDone = true;
            break;
          }
          continue;
        }
        return isShotAlreadyDone;
      }
      function getRandomNumBetween1And10() {
        return Math.floor(Math.random() * 10) + 1;
      }
    },
  };
}
