import { gameState, resources } from "./state.js";
import { calculateTotalScore } from "./scoring.js";
import { updateDragonScenarioPanel } from "./dragonScenario.js";

const scoreElement = document.getElementById("score");
const turnElement = document.getElementById("turn");

export function updateScore() {
  scoreElement.textContent = calculateTotalScore();
}

export function updateTurns() {
  turnElement.textContent = gameState.turnCount;
}

export function updateResources() {
  document.getElementById("food").textContent = resources.food;
  document.getElementById("wood").textContent = resources.wood;
  document.getElementById("stone").textContent = resources.stone;
  document.getElementById("gold").textContent = resources.gold;
  document.getElementById("population").textContent = resources.population;
}

export function updateHud() {
  updateScore();
  updateResources();
  updateTurns();
  updateDragonScenarioPanel();
}
