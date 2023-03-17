import { Gameboard } from './gameboard.js';

export function Player(name, isComputer = false) {
  return {
    name,
    isComputer,
    didLastShotHit: false,
    lastShotCoords: null,
    possibleShotsIfLastHit: null,
    firstHitCoords: null,
    hitAxis: null,
    hitDirection: null,
    isMyTurn: null,
    gameboard: new Gameboard(),

    attackEnemy(attackCoords, enemyPlayer) {
      const attackResponse = enemyPlayer.gameboard.receiveAttack(attackCoords);
      if (attackResponse.isHit) {
        this.didLastShotHit = true;
      } else {
        this.didLastShotHit = false;
      }
      this.lastShotCoords = attackCoords;

      if (attackResponse.didSink) {
        this.mutatePlayerObjectAfterSinkingShip();
      }
      return attackResponse;
    },

    placeShipsRandomly() {
      for (let i = 5; i >= 1; i -= 1) {
        const length = i;
        let startCoord = this.calculateRandomCoords();
        const axis = this.calculateRandomAxis();

        while (
          !this.gameboard.determineIfShipIsOnGameboard(
            length,
            startCoord,
            axis
          ) ||
          this.gameboard.determineIfShipIsOnAnotherShip(
            length,
            startCoord,
            axis
          )
        ) {
          startCoord = this.calculateRandomCoords();
        }

        switch (i) {
          case 5:
            this.gameboard.placeShip(
              length,
              this.name,
              'Carrier',
              startCoord,
              axis
            );
            break;
          case 4:
            this.gameboard.placeShip(
              length,
              this.name,
              'Battleship',
              startCoord,
              axis
            );
            break;
          case 3:
            this.gameboard.placeShip(
              length,
              this.name,
              'Cruiser',
              startCoord,
              axis
            );
            break;
          case 2:
            this.gameboard.placeShip(
              length + 1,
              this.name,
              'Submarine',
              startCoord,
              axis
            );
            break;
          case 1:
            this.gameboard.placeShip(
              length + 1,
              this.name,
              'Destroyer',
              startCoord,
              axis
            );
            break;
          default:
            console.log('shit');
        }
      }
    },

    computerShot(enemyPlayer) {
      if (!this.isComputer) return;
      let nextShot;

      if (
        this.hitAxis !== null &&
        this.hitDirection !== null &&
        !this.didLastShotHit
      ) {
        console.log('Attacking ship if end is reached but not sunk');
        nextShot = this.shotIfEndOfShipButNotSunk();
        this.attackEnemy(nextShot, enemyPlayer);
        return nextShot;
      }

      if (
        this.hitAxis !== null &&
        this.hitDirection !== null &&
        this.didLastShotHit
      ) {
        console.log('Attacking ship on axis and direction');
        nextShot = this.shotIfShipIsHitTwice();
        console.log({ nextShot });
        this.attackEnemy(nextShot, enemyPlayer);
        return nextShot;
      }

      if (this.didLastShotHit || this.possibleShotsIfLastHit !== null) {
        console.log('Attacking on search pattern');
        if (this.possibleShotsIfLastHit === null) {
          this.possibleShotsIfLastHit = [
            [this.lastShotCoords[0] + 1, this.lastShotCoords[1]],
            [this.lastShotCoords[0] - 1, this.lastShotCoords[1]],
            [this.lastShotCoords[0], this.lastShotCoords[1] + 1],
            [this.lastShotCoords[0], this.lastShotCoords[1] - 1],
          ];
        }

        nextShot = this.shotIfLookingForSecondHit(enemyPlayer);
        this.attackEnemy(nextShot, enemyPlayer);
        this.mutatePlayerObjectOnHit();
        return nextShot;
      }

      // * No hit, no ship in sinking, random shot
      if (!this.didLastShotHit && this.possibleShotsIfLastHit === null) {
        console.log('RANDOM SHOT');

        nextShot = this.randomShot(enemyPlayer);
        this.attackEnemy(nextShot, enemyPlayer);
        return nextShot;
      }
    },

    shotIfEndOfShipButNotSunk() {
      let nextShot;

      if (this.hitDirection === 'positive') {
        this.hitDirection = 'negative';
      } else if (this.hitDirection === 'negative') {
        this.hitDirection = 'positive';
      }

      if (this.hitAxis === 'X') {
        if (this.hitDirection === 'positive') {
          nextShot = [this.firstHitCoords[0] + 1, this.firstHitCoords[1]];
        } else if (this.hitDirection === 'negative') {
          nextShot = [this.firstHitCoords[0] - 1, this.firstHitCoords[1]];
        }
      } else if (this.hitAxis === 'Y') {
        if (this.hitDirection === 'positive') {
          nextShot = [this.firstHitCoords[0], this.firstHitCoords[1] + 1];
        } else if (this.hitDirection === 'negative') {
          nextShot = [this.firstHitCoords[0], this.firstHitCoords[1] - 1];
        }
      }
      return nextShot;
    },

    shotIfShipIsHitTwice() {
      let nextShot;
      if (this.hitAxis === 'X') {
        if (this.hitDirection === 'positive') {
          nextShot = [this.lastShotCoords[0] + 1, this.lastShotCoords[1]];
        } else if (this.hitDirection === 'negative') {
          nextShot = [this.lastShotCoords[0] - 1, this.lastShotCoords[1]];
        }
      } else if (this.hitAxis === 'Y') {
        if (this.hitDirection === 'positive') {
          nextShot = [this.lastShotCoords[0], this.lastShotCoords[1] + 1];
        } else if (this.hitDirection === 'negative') {
          nextShot = [this.lastShotCoords[0], this.lastShotCoords[1] - 1];
        }
      }
      console.log({ shotIfShipIsHitTwice: nextShot });
      return nextShot;
    },

    shotIfLookingForSecondHit(enemyPlayer) {
      let nextShot;
      if (this.firstHitCoords === null)
        this.firstHitCoords = this.lastShotCoords;
      nextShot = this.possibleShotsIfLastHit.splice(
        Math.floor(Math.random() * this.possibleShotsIfLastHit.length),
        1
      );
      while (this.isNextShotAlreadyDone(nextShot[0], enemyPlayer)) {
        nextShot = this.possibleShotsIfLastHit.splice(
          Math.floor(Math.random() * this.possibleShotsIfLastHit.length),
          1
        );
      }
      return nextShot[0];
    },

    randomShot(enemyPlayer) {
      console.log('RANDOM');
      let nextShot = this.calculateNextShotCoords();

      while (this.isNextShotAlreadyDone(nextShot, enemyPlayer)) {
        nextShot = this.calculateNextShotCoords();
      }
      return nextShot;
    },

    mutatePlayerObjectAfterSinkingShip() {
      this.didLastShotHit = false;
      this.possibleShotsIfLastHit = null;
      this.firstHitCoords = null;
      this.hitAxis = null;
      this.hitDirection = null;
    },

    mutatePlayerObjectOnHit() {
      if (this.didLastShotHit) {
        const hitDirData = [
          this.firstHitCoords[0] - this.lastShotCoords[0],
          this.firstHitCoords[1] - this.lastShotCoords[1],
        ];
        if (hitDirData[0] !== 0) {
          this.hitAxis = 'X';
        } else {
          this.hitAxis = 'Y';
        }
        if (hitDirData[0] === -1 || hitDirData[1] === -1) {
          this.hitDirection = 'positive';
        } else {
          this.hitDirection = 'negative';
        }
      }
    },

    calculateNextShotCoords() {
      return [
        this.getRandomNumBetween1And10(),
        this.getRandomNumBetween1And10(),
      ];
    },

    calculateRandomCoords() {
      return [
        this.getRandomNumBetween1And10(),
        this.getRandomNumBetween1And10(),
      ];
    },

    calculateRandomAxis() {
      return Math.floor(Math.random() * 2) ? 'X' : 'Y';
    },

    isNextShotAlreadyDone(shotCoords, enemyPlayer) {
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
    },

    getRandomNumBetween1And10() {
      return Math.floor(Math.random() * 10) + 1;
    },
  };
}
