export function Ship(length, team, type, coordinates, axis) {
  return {
    team,
    type,
    id: `${type.toLowerCase()}-${team}`,
    length,
    startCoordinates: coordinates,
    axis,
    numberOfHits: 0,
    hit() {
      this.numberOfHits += 1;
    },
    isSunk() {
      if (this.numberOfHits >= length) return true;
      return false;
    },
  };
}
