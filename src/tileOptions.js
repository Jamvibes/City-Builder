import { gameState, resources } from "./state.js";
import { tileTypes, getTileName, getTerrainName } from "./tiles.js";
import { draw } from "./renderer.js";
import { drawValidPlacementHighlights } from "./highlights.js";
import { updateResources } from "./hud.js";
import { updateSettlementPanel } from "./settlement.js";
import { getUnlockedRarities } from "./settlement.js";

const OPTION_COUNT = 3;
const REROLL_COST = 1;

const resourceIcons = {
  food: "🌾",
  wood: "🌲",
  stone: "⛏️",
  gold: "✨",
  population: "👥"
};

export function drawRandomOptions() {
  const nextOptions = [];

  for (let i = 0; i < OPTION_COUNT; i++) {
    if (gameState.lockedOptions[i] && gameState.currentOptions[i] && isTileCurrentlyUnlocked(gameState.currentOptions[i])) {
      nextOptions.push(gameState.currentOptions[i]);
    } else {
      nextOptions.push(getRandomTile());
    }
  }

  gameState.currentOptions = nextOptions;

  if (!gameState.currentOptions.includes(gameState.selectedTile)) {
    gameState.selectedTile = gameState.currentOptions[0];
  }

  updateTileOptionsUI();
}

export function rerollTileOptions() {
  if (resources.gold < REROLL_COST) {
    updateTileOptionsUI();
    return;
  }

  resources.gold -= REROLL_COST;
  drawRandomOptions();
  draw();
  drawValidPlacementHighlights();
  updateResources();
  updateSettlementPanel();
}

export function updateTileOptionsUI() {
  const optionsDiv = document.getElementById("tileOptions");
  optionsDiv.textContent = "";

  gameState.currentOptions.forEach((tileKey, index) => {
    const tile = tileTypes[tileKey];
    const card = createTileCard(tileKey, tile, index);
    optionsDiv.appendChild(card);
  });

  updateRerollButton();
}

function createTileCard(tileKey, tile, index) {
  const button = document.createElement("button");
  button.className = "tile-option";

  if (tileKey === gameState.selectedTile) {
    button.classList.add("selected");
  }

  if (gameState.lockedOptions[index]) {
    button.classList.add("locked");
  }

  const header = document.createElement("div");
  header.className = "tile-card-header";

  const label = document.createElement("div");
  label.className = "tile-label";
  label.textContent = tile.label;
  label.style.background = tile.colour;

  const titleBlock = document.createElement("div");
  titleBlock.className = "tile-title-block";

  const name = document.createElement("div");
  name.className = "tile-name";
  name.textContent = tile.name;

  const rarity = document.createElement("div");
  rarity.className = "tile-rarity";
  rarity.textContent = tile.rarity;

  titleBlock.appendChild(name);
  titleBlock.appendChild(rarity);

  const lockButton = document.createElement("span");
  lockButton.className = "tile-lock";
  lockButton.textContent = gameState.lockedOptions[index] ? "🔒 Locked" : "🔓 Lock";
  lockButton.title = gameState.lockedOptions[index]
    ? "Unlock this option so it rerolls next turn"
    : "Lock this option so it stays next turn";

  lockButton.onclick = event => {
    event.stopPropagation();
    gameState.lockedOptions[index] = !gameState.lockedOptions[index];
    updateTileOptionsUI();
  };

  header.appendChild(label);
  header.appendChild(titleBlock);
  header.appendChild(lockButton);

  const description = document.createElement("div");
  description.className = "tile-description";
  description.textContent = tile.description;

  const stats = document.createElement("div");
  stats.className = "tile-stats";

  stats.appendChild(createStatLine(`⭐ Score: +${tile.baseScore}`));

  const resourceEntries = Object.entries(tile.resources).filter(([, value]) => value !== 0);
  if (resourceEntries.length === 0) {
    stats.appendChild(createStatLine("No resources"));
  } else {
    resourceEntries.forEach(([resource, value]) => {
      const sign = value > 0 ? "+" : "";
      stats.appendChild(createStatLine(`${resourceIcons[resource]} ${formatResourceName(resource)}: ${sign}${value}`));
    });
  }

  const terrain = document.createElement("div");
  terrain.className = "tile-upgrades";
  terrain.textContent = `🧭 Terrain: ${formatAllowedTerrain(tile)}`;
  stats.appendChild(terrain);

  const upgrades = document.createElement("div");
  upgrades.className = "tile-upgrades";
  upgrades.textContent = `⬆ Upgrades: ${formatUpgrades(tile)}`;
  stats.appendChild(upgrades);

  button.appendChild(header);
  button.appendChild(description);
  button.appendChild(stats);

  button.onclick = () => {
    gameState.selectedTile = tileKey;
    updateTileOptionsUI();
    draw();
    drawValidPlacementHighlights();
  };

  return button;
}

function updateRerollButton() {
  const button = document.getElementById("rerollTilesButton");
  if (!button) return;

  button.disabled = resources.gold < REROLL_COST;
  button.textContent = resources.gold >= REROLL_COST
    ? `🔄 Reroll Tiles (${REROLL_COST} gold)`
    : `🔄 Need ${REROLL_COST} gold to reroll`;
  button.onclick = rerollTileOptions;
}

function getRandomTile() {
  const availableTiles = getAvailableTiles();
  return availableTiles[Math.floor(Math.random() * availableTiles.length)];
}

function getAvailableTiles() {
  const unlockedRarities = getUnlockedRarities();

  return Object.keys(tileTypes).filter(tileKey => {
    return unlockedRarities.includes(tileTypes[tileKey].rarity);
  });
}

function isTileCurrentlyUnlocked(tileKey) {
  return getAvailableTiles().includes(tileKey);
}

function createStatLine(text) {
  const line = document.createElement("div");
  line.textContent = text;
  return line;
}

function formatAllowedTerrain(tile) {
  if (!tile.allowedTerrain || tile.allowedTerrain.length === 0) {
    return "Any";
  }

  return tile.allowedTerrain.map(getTerrainName).join(" • ");
}

function formatUpgrades(tile) {
  if (tile.upgradesTo.length === 0) {
    return "None";
  }

  return tile.upgradesTo.map(getTileName).join(" • ");
}

function formatResourceName(resource) {
  if (resource === "population") return "Population";
  return resource.charAt(0).toUpperCase() + resource.slice(1);
}
