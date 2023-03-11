export function Ship(length) {
  return {
    length,
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
const carrier = new Ship(5);
console.log(carrier);
