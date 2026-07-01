import { camera, canvas, ctx, directions, placedTiles } from "./state.js";
import { terrainTypes, tileTypes } from "./tiles.js";
import { getHexCorners, hexToPixel } from "./hex.js";
import { getTerrainAt } from "./terrain.js";
import { getValidPlacementSpots } from "./placementRules.js";
import { updateScore } from "./hud.js";

export function drawHex(q, r, type, isValidSpot = false, isTerrain = false) {
  const position = hexToPixel(q, r);
  const corners = getHexCorners(position.x, position.y);

  ctx.beginPath();
  ctx.moveTo(corners[0].x, corners[0].y);

  for (let i = 1; i < corners.length; i++) {
    ctx.lineTo(corners[i].x, corners[i].y);
  }

  ctx.closePath();

  if (isTerrain) {
    ctx.fillStyle = terrainTypes[type].colour;
    ctx.fill();
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 1;
    ctx.stroke();
    drawHexLabel(terrainTypes[type].label, terrainTypes[type].textColour, position.x, position.y);
    return;
  }

  if (isValidSpot) {
    drawPlacementOverlay();
    return;
  }

  if (type && tileTypes[type]) {
    ctx.fillStyle = tileTypes[type].colour;
  } else {
    ctx.fillStyle = "#88c999";
  }

  ctx.fill();
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 1;
  ctx.stroke();

  if (type && tileTypes[type]) {
    drawHexLabel(tileTypes[type].label, "#222", position.x, position.y);
  }
}

function drawPlacementOverlay() {
  ctx.save();
  ctx.strokeStyle = "#111";
  ctx.lineWidth = 3 / camera.zoom;
  ctx.setLineDash([6 / camera.zoom, 5 / camera.zoom]);
  ctx.stroke();
  ctx.restore();
}

function drawHexLabel(label, colour, x, y) {
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `bold ${16 / camera.zoom}px Arial`;
  ctx.fillStyle = colour;
  ctx.fillText(label, x, y);
}

export function draw() {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(camera.x, camera.y);
  ctx.scale(camera.zoom, camera.zoom);

  const visibleTerrainTiles = new Set();

  for (const key in placedTiles) {
    const tile = placedTiles[key];

    for (const [dq, dr] of directions) {
      const q = tile.q + dq;
      const r = tile.r + dr;
      const terrainKey = `${q},${r}`;

      if (!placedTiles[terrainKey]) {
        visibleTerrainTiles.add(terrainKey);
      }
    }
  }

  for (const terrainKey of visibleTerrainTiles) {
    const [q, r] = terrainKey.split(",").map(Number);
    const terrain = getTerrainAt(q, r);
    drawHex(q, r, terrain, false, true);
  }

  const validSpots = getValidPlacementSpots();
  for (const spot of validSpots) {
    drawHex(spot.q, spot.r, null, true);
  }

  for (const key in placedTiles) {
    const tile = placedTiles[key];
    drawHex(tile.q, tile.r, tile.type);
  }

  ctx.restore();
  updateScore();
}
