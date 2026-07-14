import { camera, canvas, gameState } from "./state.js";
import { pixelToHex } from "./hex.js";
import { placeTile } from "./placement.js";
import { draw } from "./renderer.js";
import { drawPixelTerrainOverlay } from "./pixelTerrainOverlay.js";
import { drawValidPlacementHighlights } from "./highlights.js";
import { drawRandomOptions } from "./tileOptions.js";
import { updateHud } from "./hud.js";
import { updateSettlementPanel } from "./settlement.js";

const ZOOM_SPEED = 0.0015;
const DRAG_THRESHOLD = 4;

let isPanning = false;
let hasDragged = false;
let lastMouseX = 0;
let lastMouseY = 0;

canvas.addEventListener("contextmenu", event => {
  event.preventDefault();
});

canvas.addEventListener("mousedown", event => {
  if (isPanButton(event)) {
    isPanning = true;
    hasDragged = false;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
    canvas.style.cursor = "grabbing";
    event.preventDefault();
  }
});

canvas.addEventListener("mousemove", event => {
  if (!isPanning) return;

  const deltaX = event.clientX - lastMouseX;
  const deltaY = event.clientY - lastMouseY;

  if (Math.abs(deltaX) > DRAG_THRESHOLD || Math.abs(deltaY) > DRAG_THRESHOLD) {
    hasDragged = true;
  }

  camera.x += deltaX;
  camera.y += deltaY;
  lastMouseX = event.clientX;
  lastMouseY = event.clientY;

  redrawMap();
});

window.addEventListener("mouseup", () => {
  isPanning = false;
  canvas.style.cursor = "default";
});

canvas.addEventListener("wheel", event => {
  event.preventDefault();

  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;
  const previousZoom = camera.zoom;
  const zoomAmount = 1 - event.deltaY * ZOOM_SPEED;
  const nextZoom = clamp(previousZoom * zoomAmount, camera.minZoom, camera.maxZoom);

  const worldXBeforeZoom = (mouseX - camera.x) / previousZoom;
  const worldYBeforeZoom = (mouseY - camera.y) / previousZoom;

  camera.zoom = nextZoom;
  camera.x = mouseX - worldXBeforeZoom * nextZoom;
  camera.y = mouseY - worldYBeforeZoom * nextZoom;

  redrawMap();
}, { passive: false });

canvas.addEventListener("click", event => {
  if (hasDragged) {
    hasDragged = false;
    return;
  }

  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;
  const hex = pixelToHex(mouseX, mouseY);

  placeTile(hex.q, hex.r, gameState.selectedTile);
});

function redrawMap() {
  draw();
  drawPixelTerrainOverlay();
  drawValidPlacementHighlights();
}

function isPanButton(event) {
  return event.button === 1 || event.button === 2 || event.shiftKey;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

drawRandomOptions();
redrawMap();
updateHud();
updateSettlementPanel();
