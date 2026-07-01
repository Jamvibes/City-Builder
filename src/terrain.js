import { directions, terrainTiles } from "./state.js";
import { terrainTypes } from "./tiles.js";

const MATCH_NEIGHBOUR_CHANCE = 0.7;

const fallbackTerrainWeights = {
  grassland: 5,
  forest: 3,
  mountain: 2,
  water: 2
};

export function getRandomTerrain() {
  return chooseWeightedTerrain(fallbackTerrainWeights);
}

export function getTerrainAt(q, r) {
  const key = `${q},${r}`;

  if (!terrainTiles[key]) {
    terrainTiles[key] = generateTerrain(q, r);
  }

  return terrainTiles[key];
}

function generateTerrain(q, r) {
  const neighbouringTerrain = getNeighbouringTerrain(q, r);

  if (neighbouringTerrain.length > 0 && Math.random() < MATCH_NEIGHBOUR_CHANCE) {
    return chooseTerrainFromNeighbours(neighbouringTerrain);
  }

  return getRandomTerrain();
}

function getNeighbouringTerrain(q, r) {
  const neighbours = [];

  for (const [dq, dr] of directions) {
    const neighbourKey = `${q + dq},${r + dr}`;

    if (terrainTiles[neighbourKey]) {
      neighbours.push(terrainTiles[neighbourKey]);
    }
  }

  return neighbours;
}

function chooseTerrainFromNeighbours(neighbouringTerrain) {
  const weights = {};

  neighbouringTerrain.forEach(terrain => {
    weights[terrain] = (weights[terrain] || 0) + 1;
  });

  return chooseWeightedTerrain(weights);
}

function chooseWeightedTerrain(weights) {
  const entries = Object.entries(weights).filter(([terrain, weight]) => {
    return terrainTypes[terrain] && weight > 0;
  });

  const totalWeight = entries.reduce((total, [, weight]) => total + weight, 0);
  let roll = Math.random() * totalWeight;

  for (const [terrain, weight] of entries) {
    roll -= weight;

    if (roll <= 0) {
      return terrain;
    }
  }

  return Object.keys(terrainTypes)[0];
}
