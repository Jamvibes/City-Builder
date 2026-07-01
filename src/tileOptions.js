import { gameState } from "./state.js";
import { tileBag, tileTypes, getTileName } from "./tiles.js";

const resourceIcons = {
  food: "🌾",
  wood: "🌲",
  stone: "⛏️",
  gold: "✨",
  population: "👥"
};

export function drawRandomOptions() {
  gameState.currentOptions = [];

  for (let i = 0; i < 3; i++) {
    const randomTile = tileBag[Math.floor(Math.random() * tileBag.length)];
    gameState.currentOptions.push(randomTile);
  }

  gameState.selectedTile = gameState.currentOptions[0];
  updateTileOptionsUI();
}

export function updateTileOptionsUI() {
  const optionsDiv = document.getElementById("tileOptions");
  optionsDiv.textContent = "";

  gameState.currentOptions.forEach(tileKey => {
    const tile = tileTypes[tileKey];
    const card = createTileCard(tileKey, tile);
    optionsDiv.appendChild(card);
  });
}

function createTileCard(tileKey, tile) {
  const button = document.createElement("button");
  button.className = "tile-option";

  if (tileKey === gameState.selectedTile) {
    button.classList.add("selected");
  }

  const header = document.createElement("div");
  header.className = "tile-card-header";

  const label = document.createElement("div");
  label.className = "tile-label";
  label.textContent = tile.label;
  label.style.background = tile.colour;

  const titleBlock = document.createElement("div");

  const name = document.createElement("div");
  name.className = "tile-name";
  name.textContent = tile.name;

  const rarity = document.createElement("div");
  rarity.className = "tile-rarity";
  rarity.textContent = tile.rarity;

  titleBlock.appendChild(name);
  titleBlock.appendChild(rarity);
  header.appendChild(label);
  header.appendChild(titleBlock);

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
  };

  return button;
}

function createStatLine(text) {
  const line = document.createElement("div");
  line.textContent = text;
  return line;
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
