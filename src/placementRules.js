import { directions, placedTiles } from "./state.js";

export function getValidPlacementSpots() {
  const spots = {};

  for (const key in placedTiles) {
    const tile = placedTiles[key];

    for (const [dq, dr] of directions) {
      const q = tile.q + dq;
      const r = tile.r + dr;
      const newKey = `${q},${r}`;

      if (!placedTiles[newKey]) {
        spots[newKey] = { q, r };
      }
    }
  }

  return Object.values(spots);
}

export function canPlaceTile(q, r) {
  const key = `${q},${r}`;

  if (placedTiles[key]) {
    return false;
  }

  return directions.some(([dq, dr]) => {
    const neighbourKey = `${q + dq},${r + dr}`;
    return placedTiles[neighbourKey];
  });
}
