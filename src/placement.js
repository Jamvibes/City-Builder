import { directions, gameState, placedTiles, resources } from "./state.js";
import { tileTypes } from "./tiles.js";
import { draw } from "./renderer.js";
import { drawRandomOptions } from "./tileOptions.js";
import { updateResources, updateTurns } from "./hud.js";

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

export function placeTile(q, r, type) {
  if (!type || !canPlaceTile(q, r)) {
    return;
  }

  placedTiles[`${q},${r}`] = {
    q,
    r,
    type
  };

  const tileResource = tileTypes[type].resources;
  resources.food += tileResource.food;
  resources.wood += tileResource.wood;
  resources.stone += tileResource.stone;
  resources.gold += tileResource.gold;
  resources.population += tileResource.population;

  gameState.turnCount++;

  drawRandomOptions();
  draw();
  updateResources();
  updateTurns();
}

export function upgradeTile(q, r, newType) {
  const key = `${q},${r}`;
  const tile = placedTiles[key];

  if (!tile) return;

  const possibleUpgrades = tileTypes[tile.type].upgradesTo;

  if (!possibleUpgrades.includes(newType)) {
    return;
  }

  const oldResources = tileTypes[tile.type].resources;
  const newResources = tileTypes[newType].resources;

  resources.food += newResources.food - oldResources.food;
  resources.wood += newResources.wood - oldResources.wood;
  resources.stone += newResources.stone - oldResources.stone;
  resources.gold += newResources.gold - oldResources.gold;
  resources.population += newResources.population - oldResources.population;

  tile.type = newType;
  draw();
  updateResources();
}
