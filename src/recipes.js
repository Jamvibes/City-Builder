import { directions, placedTiles, resources } from "./state.js";
import { tileTypes } from "./tiles.js";

const recipes = [
  {
    id: "three-farms-windmill",
    name: "Windmill",
    type: "connected-count",
    triggerTile: "farm",
    requiredTile: "farm",
    requiredConnectedCount: 3,
    resultTile: "windmill"
  },
  {
    id: "mine-triangle-dragon-lair",
    name: "Dragon's Lair",
    type: "triangle",
    triggerTile: "mine",
    requiredTile: "mine",
    resultTile: "dragonLair",
    goldCost: 20
  }
];

export function applyRecipesFromPlacement(q, r, placedType) {
  for (const recipe of recipes) {
    if (placedType !== recipe.triggerTile) {
      continue;
    }

    if (recipe.type === "connected-count" && matchesConnectedCountRecipe(q, r, recipe)) {
      evolvePlacedTile(q, r, placedType, recipe.resultTile);
      return recipe;
    }

    if (recipe.type === "triangle" && matchesTriangleRecipe(q, r, recipe)) {
      resources.gold -= recipe.goldCost || 0;
      evolvePlacedTile(q, r, placedType, recipe.resultTile);
      return recipe;
    }
  }

  return null;
}

function matchesConnectedCountRecipe(q, r, recipe) {
  const connectedTiles = getConnectedTilesOfType(q, r, recipe.requiredTile);
  return connectedTiles.length >= recipe.requiredConnectedCount;
}

function matchesTriangleRecipe(q, r, recipe) {
  if ((recipe.goldCost || 0) > resources.gold) {
    return false;
  }

  const neighbouringMineKeys = getNeighbouringTileKeysOfType(q, r, recipe.requiredTile);

  for (let i = 0; i < neighbouringMineKeys.length; i++) {
    for (let j = i + 1; j < neighbouringMineKeys.length; j++) {
      if (areTilesAdjacent(neighbouringMineKeys[i], neighbouringMineKeys[j])) {
        return true;
      }
    }
  }

  return false;
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

function getNeighbouringTileKeysOfType(q, r, type) {
  const neighbours = [];

  for (const [dq, dr] of directions) {
    const key = `${q + dq},${r + dr}`;
    const tile = placedTiles[key];

    if (tile?.type === type) {
      neighbours.push(key);
    }
  }

  return neighbours;
}

function areTilesAdjacent(firstKey, secondKey) {
  const first = placedTiles[firstKey];
  const second = placedTiles[secondKey];

  if (!first || !second) {
    return false;
  }

  return directions.some(([dq, dr]) => {
    return first.q + dq === second.q && first.r + dr === second.r;
  });
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
