import { terrainTiles } from "./state.js";
import { terrainTypes } from "./tiles.js";

export function getRandomTerrain() {
  const terrainKeys = Object.keys(terrainTypes);
  return terrainKeys[Math.floor(Math.random() * terrainKeys.length)];
}

export function getTerrainAt(q, r) {
  const key = `${q},${r}`;

  if (!terrainTiles[key]) {
    terrainTiles[key] = getRandomTerrain();
  }

  return terrainTiles[key];
}
