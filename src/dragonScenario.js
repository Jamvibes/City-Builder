import { gameState, placedTiles, resources } from "./state.js";
import { tileTypes } from "./tiles.js";

const TOWN_CENTRE_KEY = "0,0";
const PROTECTED_TYPES = new Set(["castle", "townCentre", "dragonLair", "burnedTile"]);

export function activateDragonScenario() {
  const scenario = gameState.dragonScenario;

  if (scenario.active || scenario.defeated) {
    return;
  }

  scenario.active = true;
  scenario.turnsActive = 0;
  scenario.burnedTiles = 0;
  scenario.message = "The mines have disturbed an ancient dragon. Raise an army before your settlement burns.";

  transformTownCentreIntoCastle();
  updateDragonScenarioPanel();
}

export function processDragonScenarioTurn() {
  const scenario = gameState.dragonScenario;

  if (!scenario.active || scenario.defeated) {
    updateDragonScenarioPanel();
    return;
  }

  if (resources.population >= scenario.requiredPopulation) {
    defeatDragon();
    updateDragonScenarioPanel();
    return;
  }

  scenario.turnsActive++;
  burnRandomTile();
  updateDragonScenarioPanel();
}

export function updateDragonScenarioPanel() {
  const panel = document.getElementById("objectivePanel");
  if (!panel) return;

  const scenario = gameState.dragonScenario;

  if (scenario.defeated) {
    panel.innerHTML = `
      <h3>🏆 Dragon Defeated</h3>
      <p>Your army has driven the dragon back into legend.</p>
      <div class="objective-complete">✓ Castle defended</div>
      <div class="objective-complete">✓ Population ${resources.population}/${scenario.requiredPopulation}</div>
      <div class="objective-complete">✓ Dragon threat ended</div>
    `;
    return;
  }

  if (!scenario.active) {
    panel.innerHTML = `
      <h3>Current Objective</h3>
      <p>Build your settlement and discover a legacy.</p>
      <div class="objective-muted">No active crisis.</div>
    `;
    return;
  }

  const populationReady = resources.population >= scenario.requiredPopulation;

  panel.innerHTML = `
    <h3>🐉 The Dragon Awakens</h3>
    <p>${scenario.message}</p>
    <div class="objective-line objective-complete">✓ Town Centre fortified into a Castle</div>
    <div class="objective-line ${populationReady ? "objective-complete" : ""}">
      ${populationReady ? "✓" : "□"} Raise an army: Population ${resources.population}/${scenario.requiredPopulation}
    </div>
    <div class="objective-line">🔥 Dragon burns one tile each turn</div>
    <div class="objective-line">Scorched tiles: ${scenario.burnedTiles}</div>
    <p class="objective-hint">Reach the population target to defeat the dragon.</p>
  `;
}

function transformTownCentreIntoCastle() {
  const tile = placedTiles[TOWN_CENTRE_KEY];

  if (!tile || tile.type === "castle") {
    return;
  }

  adjustResourcesForTileChange(tile.type, "castle");
  tile.type = "castle";
}

function defeatDragon() {
  const scenario = gameState.dragonScenario;
  scenario.active = false;
  scenario.defeated = true;
  scenario.message = "The dragon has been defeated.";
}

function burnRandomTile() {
  const burnableTiles = Object.values(placedTiles).filter(tile => {
    return !PROTECTED_TYPES.has(tile.type);
  });

  if (burnableTiles.length === 0) {
    gameState.dragonScenario.message = "The dragon circles overhead, but finds nothing new to burn.";
    return;
  }

  const tile = burnableTiles[Math.floor(Math.random() * burnableTiles.length)];
  const oldType = tile.type;

  adjustResourcesForTileChange(oldType, "burnedTile");
  tile.previousType = oldType;
  tile.type = "burnedTile";

  gameState.dragonScenario.burnedTiles++;
  gameState.dragonScenario.message = `The dragon scorched a ${tileTypes[oldType]?.name ?? oldType}.`;
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
