import { directions, gameState, placedTiles } from "./state.js";
import { getTerrainAt } from "./terrain.js";
import { tileTypes } from "./tiles.js";

export function getValidPlacementSpots(tileType = gameState.selectedTile) {
  const spots = {};

  for (const key in placedTiles) {
    const tile = placedTiles[key];

    for (const [dq, dr] of directions) {
      const q = tile.q + dq;
      const r = tile.r + dr;
      const newKey = `${q},${r}`;

      if (!placedTiles[newKey] && isAllowedTerrain(q, r, tileType)) {
        spots[newKey] = { q, r };
      }
    }
  }

  return Object.values(spots);
}

export function canPlaceTile(q, r, tileType = null) {
  const key = `${q},${r}`;

  if (placedTiles[key] || !isAllowedTerrain(q, r, tileType)) {
    return false;
  }

  return directions.some(([dq, dr]) => {
    const neighbourKey = `${q + dq},${r + dr}`;
    return placedTiles[neighbourKey];
  });
}

function isAllowedTerrain(q, r, tileType) {
  if (!tileType || !tileTypes[tileType]?.allowedTerrain) {
    return true;
  }

  const terrain = getTerrainAt(q, r);
  return tileTypes[tileType].allowedTerrain.includes(terrain);
}
