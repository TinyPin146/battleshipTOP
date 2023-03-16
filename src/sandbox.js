if (
  this.hitAxis !== null &&
  this.hitDirection !== null &&
  !this.didLastShotHit
) {
  shotIfEndOfShipButNotSunk.call(this);
}
function shotIfEndOfShipButNotSunk() {
  if (this.hitDirection === 'positive') this.hitDirection = 'negative';
  if (this.hitDirection === 'negative') this.hitDirection = 'positive';

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
      nextShot = [this.firstHitCoords[0] - 1, this.firstHitCoords[1] - 1];
    }
  }
  this.attackEnemy(nextShot);
  return nextShot;
}

if (
  this.hitAxis !== null &&
  this.hitDirection !== null &&
  this.didLastShotHit
) {
  shotIfShipIsHitTwice.call(this);
}
function shotIfShipIsHitTwice() {
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
      nextShot = [this.lastShotCoords[0] - 1, this.lastShotCoords[1] - 1];
    }
  }
  this.attackEnemy(nextShot);
  return nextShot;
}

if (this.didLastShotHit || this.possibleShotsIfLastHit !== null) {
  shotIfLookingForSecondHit.call(this);
}
function shotIfLookingForSecondHit() {
  console.log('After first hit finding next hit');
  this.firstHitCoords = this.lastShotCoords;
  if (this.possibleShotsIfLastHit === null) {
    this.possibleShotsIfLastHit = [
      [this.lastShotCoords[0] + 1, this.lastShotCoords[1]],
      [this.lastShotCoords[0] - 1, this.lastShotCoords[1]],
      [this.lastShotCoords[0], this.lastShotCoords[1] + 1],
      [this.lastShotCoords[0], this.lastShotCoords[1] - 1],
    ];
  }
  nextShot = this.possibleShotsIfLastHit.splice(
    Math.floor(Math.random() * this.possibleShotsIfLastHit.length),
    1
  );
  while (isNextShotAlreadyDone(nextShot[0])) {
    nextShot = this.possibleShotsIfLastHit.splice(
      Math.floor(Math.random() * this.possibleShotsIfLastHit.length),
      1
    );
  }
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
      this.hitDirection = 'negative';
    } else {
      this.hitDirection = 'positive';
    }
  }
  return nextShot[0];
}
