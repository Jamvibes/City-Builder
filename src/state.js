import { tileTypes } from "./tiles.js";

export const canvas = document.getElementById("gameCanvas");
export const ctx = canvas.getContext("2d");

export const hexSize = 40;
export const centerX = canvas.width / 2;
export const centerY = canvas.height / 2;

export const directions = [
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, 0],
  [-1, 1],
  [0, 1]
];

export const placedTiles = {
  "0,0": {
    q: 0,
    r: 0,
    type: "townCentre"
  }
};

export const terrainTiles = {};

export const resources = {
  food: 0,
  wood: 0,
  stone: 0,
  gold: tileTypes.townCentre.resources.gold,
  population: 0
};

export const camera = {
  x: 0,
  y: 0,
  zoom: 1,
  minZoom: 0.5,
  maxZoom: 2.5
};

export const gameState = {
  turnCount: 1,
  settlementLevel: 1,
  currentOptions: [],
  lockedOptions: [false, false, false],
  selectedTile: null,
  dragonScenario: {
    active: false,
    defeated: false,
    requiredPopulation: 80,
    turnsActive: 0,
    burnedTiles: 0,
    message: "Build your settlement and discover a legacy."
  }
};
