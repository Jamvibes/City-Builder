import { placedTiles } from "./state.js";
import { tileTypes } from "./tiles.js";

export function calculateTotalScore() {
  let total = 0;

  for (const key in placedTiles) {
    const tile = placedTiles[key];

    if (tileTypes[tile.type]) {
      total += tileTypes[tile.type].baseScore;
    }
  }

  return total;
}
