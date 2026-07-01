import { canvas, ctx, directions, placedTiles } from "./state.js";
import { terrainTypes, tileTypes } from "./tiles.js";
import { getHexCorners, hexToPixel } from "./hex.js";
import { getTerrainAt } from "./terrain.js";
import { getValidPlacementSpots } from "./placement.js";
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
  } else if (isValidSpot) {
    ctx.fillStyle = "#cfe8cf";
  } else if (type && tileTypes[type]) {
    ctx.fillStyle = tileTypes[type].colour;
  } else {
    ctx.fillStyle = "#88c999";
  }

  ctx.fill();
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "bold 16px Arial";

  if (isTerrain) {
    ctx.fillStyle = terrainTypes[type].textColour;
    ctx.fillText(terrainTypes[type].label, position.x, position.y);
  } else if (type && tileTypes[type]) {
    ctx.fillStyle = "#222";
    ctx.fillText(tileTypes[type].label, position.x, position.y);
  }
}

export function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

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

  updateScore();
}
