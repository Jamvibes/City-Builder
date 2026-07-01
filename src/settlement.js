import { gameState, placedTiles, resources } from "./state.js";
import { tileTypes } from "./tiles.js";
import { draw } from "./renderer.js";
import { drawValidPlacementHighlights } from "./highlights.js";
import { drawRandomOptions } from "./tileOptions.js";
import { updateResources, updateScore } from "./hud.js";

const TOWN_CENTRE_KEY = "0,0";

export const settlementLevels = [
  {
    level: 1,
    name: "Town Centre",
    tileType: "townCentre",
    unlockedRarities: ["common"]
  },
  {
    level: 2,
    name: "Village Hall",
    tileType: "villageHall",
    unlockedRarities: ["common", "uncommon"],
    cost: { wood: 6, stone: 3, gold: 4, population: 15 }
  },
  {
    level: 3,
    name: "Keep",
    tileType: "keep",
    unlockedRarities: ["common", "uncommon", "rare"],
    cost: { wood: 12, stone: 10, gold: 12, population: 35 }
  }
];

export function getCurrentSettlementLevel() {
  return settlementLevels.find(level => level.level === gameState.settlementLevel) ?? settlementLevels[0];
}

export function getNextSettlementLevel() {
  return settlementLevels.find(level => level.level === gameState.settlementLevel + 1) ?? null;
}

export function getUnlockedRarities() {
  return getCurrentSettlementLevel().unlockedRarities;
}

export function canUpgradeSettlement() {
  const nextLevel = getNextSettlementLevel();

  if (!nextLevel) {
    return false;
  }

  return hasRequiredResources(nextLevel.cost);
}

export function upgradeSettlement() {
  const nextLevel = getNextSettlementLevel();

  if (!nextLevel || !hasRequiredResources(nextLevel.cost)) {
    updateSettlementPanel();
    return;
  }

  spendUpgradeCost(nextLevel.cost);
  transformSettlementTile(nextLevel.tileType);
  gameState.settlementLevel = nextLevel.level;

  drawRandomOptions();
  draw();
  drawValidPlacementHighlights();
  updateResources();
  updateScore();
  updateSettlementPanel();
}

export function updateSettlementPanel() {
  const panel = document.getElementById("settlementPanel");
  if (!panel) return;

  const currentLevel = getCurrentSettlementLevel();
  const nextLevel = getNextSettlementLevel();

  if (!nextLevel) {
    panel.innerHTML = `
      <h3>🏛 Settlement</h3>
      <div class="objective-complete">Level ${currentLevel.level}: ${currentLevel.name}</div>
      <p>All current rarity tiers unlocked.</p>
      <div class="objective-line">Unlocked: ${formatRarities(currentLevel.unlockedRarities)}</div>
    `;
    return;
  }

  const ready = canUpgradeSettlement();

  panel.innerHTML = `
    <h3>🏛 Settlement</h3>
    <div class="objective-line">Current: Level ${currentLevel.level} — ${currentLevel.name}</div>
    <div class="objective-line">Unlocked tiles: ${formatRarities(currentLevel.unlockedRarities)}</div>
    <div class="objective-line">Next: Level ${nextLevel.level} — ${nextLevel.name}</div>
    <div class="objective-line">Requires: ${formatCost(nextLevel.cost)}</div>
    <button id="upgradeSettlementButton" class="upgrade-button" ${ready ? "" : "disabled"}>
      ${ready ? `Upgrade to ${nextLevel.name}` : "Not enough resources"}
    </button>
  `;

  const button = document.getElementById("upgradeSettlementButton");
  if (button) {
    button.onclick = upgradeSettlement;
  }
}

function transformSettlementTile(newType) {
  const tile = placedTiles[TOWN_CENTRE_KEY];

  if (!tile || tile.type === "castle") {
    return;
  }

  adjustResourcesForTileChange(tile.type, newType);
  tile.type = newType;
}

function hasRequiredResources(cost) {
  return Object.entries(cost).every(([resource, amount]) => resources[resource] >= amount);
}

function spendUpgradeCost(cost) {
  for (const [resource, amount] of Object.entries(cost)) {
    resources[resource] -= amount;
  }
}

function adjustResourcesForTileChange(oldType, newType) {
  const oldResources = tileTypes[oldType]?.resources;
  const newResources = tileTypes[newType]?.resources;

  if (!oldResources || !newResources) {
    return;
  }

  resources.food += newResources.food - oldResources.food;
  resources.wood += newResources.wood - oldResources.wood;
  resources.stone += newResources.stone - oldResources.stone;
  resources.gold += newResources.gold - oldResources.gold;
  resources.population += newResources.population - oldResources.population;
}

function formatRarities(rarities) {
  return rarities.map(rarity => rarity.charAt(0).toUpperCase() + rarity.slice(1)).join(" • ");
}

function formatCost(cost) {
  const icons = {
    wood: "🌲",
    stone: "⛏️",
    gold: "✨",
    population: "👥"
  };

  return Object.entries(cost)
    .map(([resource, amount]) => `${icons[resource] ?? ""} ${amount} ${resource}`)
    .join(" • ");
}
