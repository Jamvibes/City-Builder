import { directions, placedTiles, resources } from "./state.js";
import { tileTypes } from "./tiles.js";

const recipes = [
  {
    id: "three-farms-windmill",
    name: "Windmill",
    triggerTile: "farm",
    requiredTile: "farm",
    requiredConnectedCount: 3,
    resultTile: "windmill"
  }
];

export function applyRecipesFromPlacement(q, r, placedType) {
  for (const recipe of recipes) {
    if (placedType !== recipe.triggerTile) {
      continue;
    }

    const connectedTiles = getConnectedTilesOfType(q, r, recipe.requiredTile);

    if (connectedTiles.length >= recipe.requiredConnectedCount) {
      evolvePlacedTile(q, r, placedType, recipe.resultTile);
      return recipe;
    }
  }

  return null;
}

function getConnectedTilesOfType(startQ, startR, type) {
  const startKey = `${startQ},${startR}`;
  const visited = new Set();
  const connected = [];
  const queue = [startKey];

  while (queue.length > 0) {
    const key = queue.shift();

    if (visited.has(key)) {
      continue;
    }

    visited.add(key);

    const tile = placedTiles[key];
    if (!tile || tile.type !== type) {
      continue;
    }

    connected.push(tile);

    for (const [dq, dr] of directions) {
      const neighbourKey = `${tile.q + dq},${tile.r + dr}`;

      if (!visited.has(neighbourKey)) {
        queue.push(neighbourKey);
      }
    }
  }

  return connected;
}

function evolvePlacedTile(q, r, oldType, newType) {
  const key = `${q},${r}`;
  const tile = placedTiles[key];

  if (!tile || tile.type !== oldType) {
    return;
  }

  const oldResources = tileTypes[oldType].resources;
  const newResources = tileTypes[newType].resources;

  resources.food += newResources.food - oldResources.food;
  resources.wood += newResources.wood - oldResources.wood;
  resources.stone += newResources.stone - oldResources.stone;
  resources.gold += newResources.gold - oldResources.gold;
  resources.population += newResources.population - oldResources.population;

  tile.type = newType;
}
