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
    drawTerrainHex(type, position.x, position.y);
    return;
  }

  if (isValidSpot) {
    drawPlacementOverlay();
    return;
  }

  ctx.fillStyle = type && tileTypes[type] ? tileTypes[type].colour : "#88c999";
  ctx.fill();

  if (type && tileTypes[type]) {
    drawPlacedTileOutline();
    drawTileArt(type, position.x, position.y);
  } else {
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 1 / camera.zoom;
    ctx.stroke();
  }
}

function drawTerrainHex(type, x, y) {
  ctx.fillStyle = terrainTypes[type].colour;
  ctx.fill();
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 1 / camera.zoom;
  ctx.stroke();

  switch (type) {
    case "water":
      drawWaterArt(x, y);
      break;
    case "forest":
      drawForestArt(x, y, 0.75);
      break;
    case "mountain":
      drawMountainArt(x, y, 0.85);
      break;
    case "grassland":
    default:
      drawGrasslandArt(x, y);
      break;
  }
}

function drawTileArt(type, x, y) {
  switch (type) {
    case "townCentre":
      drawTownCentreArt(x, y);
      break;
    case "house":
    case "villa":
    case "apartment":
      drawHouseArt(x, y, type);
      break;
    case "farm":
    case "orchard":
    case "ranch":
    case "windmill":
      drawFarmArt(x, y, type);
      break;
    case "market":
      drawMarketArt(x, y);
      break;
    case "harbor":
      drawHarborArt(x, y);
      break;
    case "woodcutter":
    case "lumberCamp":
    case "sawmill":
      drawWoodcutterArt(x, y, type);
      break;
    case "mine":
    case "quarry":
    case "deepMine":
      drawMineArt(x, y, type);
      break;
    case "dragonLair":
      drawDragonLairArt(x, y);
      break;
    default:
      drawGenericBuildingArt(x, y);
      break;
  }
}

function drawPlacedTileOutline() {
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.45)";
  ctx.shadowBlur = 8 / camera.zoom;
  ctx.strokeStyle = "#111";
  ctx.lineWidth = 4 / camera.zoom;
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
  ctx.lineWidth = 1.5 / camera.zoom;
  ctx.stroke();
  ctx.restore();
}

function drawPlacementOverlay() {
  ctx.save();
  ctx.fillStyle = "rgba(255, 235, 59, 0.18)";
  ctx.fill();
  ctx.shadowColor = "rgba(255, 235, 59, 0.95)";
  ctx.shadowBlur = 14 / camera.zoom;
  ctx.strokeStyle = "#ffeb3b";
  ctx.lineWidth = 5 / camera.zoom;
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = "#111";
  ctx.lineWidth = 1.5 / camera.zoom;
  ctx.setLineDash([5 / camera.zoom, 5 / camera.zoom]);
  ctx.stroke();
  ctx.restore();
}

function drawGrasslandArt(x, y) {
  drawGrassTuft(x - 18, y - 8);
  drawGrassTuft(x + 12, y + 12);
  drawGrassTuft(x + 2, y - 18);
}

function drawWaterArt(x, y) {
  ctx.save();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
  ctx.lineWidth = 2 / camera.zoom;
  for (let i = -1; i <= 1; i++) {
    ctx.beginPath();
    ctx.arc(x - 12, y + i * 10, 9, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.arc(x + 8, y + i * 10, 9, 1.1 * Math.PI, 1.9 * Math.PI);
    ctx.stroke();
  }
  ctx.restore();
}

function drawForestArt(x, y, scale = 1) {
  drawTree(x - 15 * scale, y + 8 * scale, scale);
  drawTree(x + 14 * scale, y + 9 * scale, scale);
  drawTree(x, y - 9 * scale, scale * 1.15);
  drawTree(x + 2 * scale, y + 17 * scale, scale * 0.9);
}

function drawMountainArt(x, y, scale = 1) {
  drawMountainPeak(x - 10 * scale, y + 7 * scale, 24 * scale);
  drawMountainPeak(x + 10 * scale, y + 9 * scale, 28 * scale);
  drawMountainPeak(x, y - 4 * scale, 34 * scale);
}

function drawHouseArt(x, y, type) {
  const size = type === "apartment" ? 1.1 : type === "villa" ? 1.05 : 0.95;
  const colour = type === "villa" ? "#f4d06f" : type === "apartment" ? "#7fc8f8" : "#d9a066";
  drawHouse(x, y + 4, size, colour);
}

function drawTownCentreArt(x, y) {
  drawHouse(x - 8, y + 7, 0.85, "#d9a066");
  drawHouse(x + 9, y + 7, 0.85, "#c9853c");
  drawBanner(x, y - 14);
}

function drawFarmArt(x, y, type) {
  drawCropRows(x, y + 4);

  if (type === "windmill") {
    drawWindmill(x, y - 8);
  } else if (type === "orchard") {
    drawTree(x - 15, y - 8, 0.65);
    drawTree(x + 15, y - 8, 0.65);
  } else if (type === "ranch") {
    drawFence(x, y - 10);
  } else {
    drawSmallBarn(x, y - 10);
  }
}

function drawMarketArt(x, y) {
  drawAwning(x, y - 8, "#ef5350", "#fff8e1");
  drawCrate(x - 14, y + 13);
  drawCrate(x + 10, y + 12);
  drawCoin(x + 19, y - 12, 6);
}

function drawHarborArt(x, y) {
  drawDock(x - 12, y + 5);
  drawBoat(x + 10, y + 12);
  drawFlag(x - 20, y - 12, "#1565c0");
}

function drawWoodcutterArt(x, y, type) {
  drawLogPile(x - 12, y + 11);
  drawAxe(x + 15, y + 6);

  if (type === "lumberCamp" || type === "sawmill") {
    drawHouse(x - 4, y - 7, 0.75, "#a06a3a");
  }

  if (type === "sawmill") {
    drawSawBlade(x + 13, y - 12);
  }
}

function drawMineArt(x, y, type) {
  drawRockPile(x, y + 10);
  drawMineEntrance(x, y - 5, type === "deepMine" ? 1.15 : 1);

  if (type === "quarry" || type === "deepMine") {
    drawCrane(x + 15, y - 11);
  }
}

function drawDragonLairArt(x, y) {
  drawMountainArt(x, y + 7, 1.05);
  drawLairCave(x, y + 5);
  drawDragonSilhouette(x, y - 7);
  drawFireGlow(x, y + 17);
}

function drawGenericBuildingArt(x, y) {
  drawHouse(x, y + 4, 0.9, "#d9a066");
}

function drawHouse(x, y, scale, wallColour) {
  const w = 24 * scale;
  const h = 18 * scale;
  ctx.save();
  ctx.fillStyle = wallColour;
  ctx.strokeStyle = "#3b2515";
  ctx.lineWidth = 2 / camera.zoom;
  ctx.fillRect(x - w / 2, y - h / 2, w, h);
  ctx.strokeRect(x - w / 2, y - h / 2, w, h);
  ctx.beginPath();
  ctx.moveTo(x - w / 2 - 4 * scale, y - h / 2);
  ctx.lineTo(x, y - h / 2 - 13 * scale);
  ctx.lineTo(x + w / 2 + 4 * scale, y - h / 2);
  ctx.closePath();
  ctx.fillStyle = "#7b3f1d";
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#2f1d11";
  ctx.fillRect(x - 4 * scale, y + h / 2 - 9 * scale, 8 * scale, 9 * scale);
  ctx.restore();
}

function drawSmallBarn(x, y) {
  ctx.save();
  ctx.fillStyle = "#b5522b";
  ctx.strokeStyle = "#3b2515";
  ctx.lineWidth = 1.7 / camera.zoom;
  ctx.fillRect(x - 9, y - 3, 18, 13);
  ctx.strokeRect(x - 9, y - 3, 18, 13);
  ctx.beginPath();
  ctx.moveTo(x - 11, y - 3);
  ctx.lineTo(x, y - 13);
  ctx.lineTo(x + 11, y - 3);
  ctx.closePath();
  ctx.fillStyle = "#6b2f1a";
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawWindmill(x, y) {
  ctx.save();
  drawHouse(x, y + 10, 0.65, "#e0c38a");
  ctx.strokeStyle = "#5d4037";
  ctx.lineWidth = 2 / camera.zoom;
  for (let i = 0; i < 4; i++) {
    const angle = (Math.PI / 2) * i + Math.PI / 4;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(angle) * 18, y + Math.sin(angle) * 18);
    ctx.stroke();
  }
  drawCircle(x, y, 3);
  ctx.restore();
}

function drawCropRows(x, y) {
  ctx.save();
  ctx.strokeStyle = "#e4c14a";
  ctx.lineWidth = 3 / camera.zoom;
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath();
    ctx.moveTo(x - 24, y + i * 6);
    ctx.lineTo(x + 24, y + i * 6 - 10);
    ctx.stroke();
  }
  ctx.restore();
}

function drawFence(x, y) {
  ctx.save();
  ctx.strokeStyle = "#8b5a2b";
  ctx.lineWidth = 2 / camera.zoom;
  ctx.beginPath();
  ctx.moveTo(x - 22, y);
  ctx.lineTo(x + 22, y - 5);
  ctx.moveTo(x - 22, y + 7);
  ctx.lineTo(x + 22, y + 2);
  ctx.stroke();
  ctx.restore();
}

function drawTree(x, y, scale = 1) {
  ctx.save();
  ctx.fillStyle = "#5b3518";
  ctx.fillRect(x - 2 * scale, y + 6 * scale, 4 * scale, 9 * scale);
  ctx.fillStyle = "#0f5c25";
  drawTriangle(x, y - 13 * scale, 11 * scale, 20 * scale);
  ctx.fillStyle = "#1f7a32";
  drawTriangle(x, y - 3 * scale, 13 * scale, 22 * scale);
  ctx.restore();
}

function drawMountainPeak(x, y, size) {
  ctx.save();
  ctx.fillStyle = "#5d4037";
  drawTriangle(x, y - size * 0.3, size * 0.5, size);
  ctx.fillStyle = "#d7ccc8";
  drawTriangle(x, y - size * 0.48, size * 0.18, size * 0.34);
  ctx.restore();
}

function drawRockPile(x, y) {
  ctx.save();
  ctx.fillStyle = "#9e9e9e";
  drawCircle(x - 12, y, 8);
  drawCircle(x + 3, y + 4, 10);
  drawCircle(x + 15, y, 7);
  ctx.strokeStyle = "#4a4a4a";
  ctx.lineWidth = 1.5 / camera.zoom;
  ctx.stroke();
  ctx.restore();
}

function drawLogPile(x, y) {
  ctx.save();
  ctx.strokeStyle = "#4e342e";
  ctx.lineWidth = 2 / camera.zoom;
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = "#8d5524";
    ctx.fillRect(x - 9 + i * 5, y - i * 5, 22, 5);
    ctx.strokeRect(x - 9 + i * 5, y - i * 5, 22, 5);
    ctx.fillStyle = "#d7a55f";
    drawCircle(x - 9 + i * 5, y - i * 5 + 2.5, 2.5);
  }
  ctx.restore();
}

function drawAxe(x, y) {
  ctx.save();
  ctx.strokeStyle = "#5d4037";
  ctx.lineWidth = 3 / camera.zoom;
  ctx.beginPath();
  ctx.moveTo(x - 9, y + 12);
  ctx.lineTo(x + 8, y - 12);
  ctx.stroke();
  ctx.fillStyle = "#cfd8dc";
  ctx.beginPath();
  ctx.moveTo(x + 6, y - 13);
  ctx.lineTo(x + 18, y - 10);
  ctx.lineTo(x + 10, y - 2);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#455a64";
  ctx.lineWidth = 1.5 / camera.zoom;
  ctx.stroke();
  ctx.restore();
}

function drawSawBlade(x, y) {
  ctx.save();
  ctx.fillStyle = "#cfd8dc";
  drawCircle(x, y, 9);
  ctx.strokeStyle = "#455a64";
  ctx.lineWidth = 1.5 / camera.zoom;
  ctx.stroke();
  ctx.fillStyle = "#5d4037";
  drawCircle(x, y, 3);
  ctx.restore();
}

function drawMineEntrance(x, y, scale) {
  ctx.save();
  ctx.fillStyle = "#2f241d";
  ctx.strokeStyle = "#8b5a2b";
  ctx.lineWidth = 3 / camera.zoom;
  ctx.beginPath();
  ctx.arc(x, y + 8 * scale, 14 * scale, Math.PI, 0);
  ctx.lineTo(x + 14 * scale, y + 16 * scale);
  ctx.lineTo(x - 14 * scale, y + 16 * scale);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawCrane(x, y) {
  ctx.save();
  ctx.strokeStyle = "#5d4037";
  ctx.lineWidth = 2 / camera.zoom;
  ctx.beginPath();
  ctx.moveTo(x, y + 18);
  ctx.lineTo(x, y - 14);
  ctx.lineTo(x + 14, y - 7);
  ctx.stroke();
  ctx.restore();
}

function drawLairCave(x, y) {
  ctx.save();
  ctx.shadowColor = "rgba(255, 87, 34, 0.8)";
  ctx.shadowBlur = 12 / camera.zoom;
  ctx.fillStyle = "#1b1110";
  ctx.strokeStyle = "#ff7043";
  ctx.lineWidth = 2 / camera.zoom;
  ctx.beginPath();
  ctx.arc(x, y + 10, 17, Math.PI, 0);
  ctx.lineTo(x + 17, y + 22);
  ctx.lineTo(x - 17, y + 22);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawDragonSilhouette(x, y) {
  ctx.save();
  ctx.fillStyle = "#6d1b16";
  ctx.strokeStyle = "#2b0b08";
  ctx.lineWidth = 1.5 / camera.zoom;

  // Wings
  ctx.beginPath();
  ctx.moveTo(x - 5, y + 5);
  ctx.lineTo(x - 28, y - 14);
  ctx.lineTo(x - 18, y + 9);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x + 5, y + 5);
  ctx.lineTo(x + 28, y - 14);
  ctx.lineTo(x + 18, y + 9);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Body, neck, head, tail
  drawEllipse(x, y + 8, 13, 9);
  drawEllipse(x + 8, y - 3, 6, 10);
  drawEllipse(x + 14, y - 13, 7, 5);

  ctx.beginPath();
  ctx.moveTo(x - 12, y + 11);
  ctx.quadraticCurveTo(x - 27, y + 10, x - 33, y + 21);
  ctx.lineWidth = 4 / camera.zoom;
  ctx.stroke();

  // Horns
  ctx.fillStyle = "#ffcc80";
  drawTriangle(x + 12, y - 18, 3, 8);
  drawTriangle(x + 18, y - 17, 3, 8);

  // Eye
  ctx.fillStyle = "#ffeb3b";
  drawCircle(x + 17, y - 14, 1.8);
  ctx.restore();
}

function drawFireGlow(x, y) {
  ctx.save();
  ctx.shadowColor = "rgba(255, 152, 0, 0.9)";
  ctx.shadowBlur = 10 / camera.zoom;
  ctx.fillStyle = "#ff9800";
  drawTriangle(x, y - 4, 8, 19);
  ctx.fillStyle = "#ffeb3b";
  drawTriangle(x, y, 4, 11);
  ctx.restore();
}

function drawAwning(x, y, stripeA, stripeB) {
  ctx.save();
  ctx.strokeStyle = "#3b2515";
  ctx.lineWidth = 1.5 / camera.zoom;
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = i % 2 === 0 ? stripeA : stripeB;
    ctx.fillRect(x - 20 + i * 10, y, 10, 12);
    ctx.strokeRect(x - 20 + i * 10, y, 10, 12);
  }
  ctx.fillStyle = "#8d6e63";
  ctx.fillRect(x - 17, y + 12, 34, 14);
  ctx.strokeRect(x - 17, y + 12, 34, 14);
  ctx.restore();
}

function drawCrate(x, y) {
  ctx.save();
  ctx.fillStyle = "#a66a2f";
  ctx.strokeStyle = "#4e342e";
  ctx.lineWidth = 1.5 / camera.zoom;
  ctx.fillRect(x - 5, y - 5, 10, 10);
  ctx.strokeRect(x - 5, y - 5, 10, 10);
  ctx.restore();
}

function drawDock(x, y) {
  ctx.save();
  ctx.strokeStyle = "#5d4037";
  ctx.lineWidth = 4 / camera.zoom;
  ctx.beginPath();
  ctx.moveTo(x - 12, y + 12);
  ctx.lineTo(x + 14, y - 8);
  ctx.stroke();
  ctx.restore();
}

function drawBoat(x, y) {
  ctx.save();
  ctx.fillStyle = "#8d5524";
  ctx.beginPath();
  ctx.moveTo(x - 14, y);
  ctx.lineTo(x + 14, y);
  ctx.lineTo(x + 7, y + 8);
  ctx.lineTo(x - 8, y + 8);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#4e342e";
  ctx.lineWidth = 1.5 / camera.zoom;
  ctx.stroke();
  ctx.strokeStyle = "#3b2515";
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y - 19);
  ctx.stroke();
  ctx.fillStyle = "#fff8e1";
  ctx.beginPath();
  ctx.moveTo(x + 1, y - 18);
  ctx.lineTo(x + 12, y - 6);
  ctx.lineTo(x + 1, y - 4);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawFlag(x, y, colour) {
  ctx.save();
  ctx.strokeStyle = "#3b2515";
  ctx.lineWidth = 2 / camera.zoom;
  ctx.beginPath();
  ctx.moveTo(x, y - 12);
  ctx.lineTo(x, y + 14);
  ctx.stroke();
  ctx.fillStyle = colour;
  ctx.beginPath();
  ctx.moveTo(x, y - 12);
  ctx.lineTo(x + 15, y - 8);
  ctx.lineTo(x, y - 4);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawBanner(x, y) {
  drawFlag(x, y, "#c62828");
}

function drawCoin(x, y, radius) {
  ctx.save();
  ctx.fillStyle = "#ffca28";
  ctx.strokeStyle = "#8d6e00";
  ctx.lineWidth = 1.5 / camera.zoom;
  drawCircle(x, y, radius);
  ctx.stroke();
  ctx.restore();
}

function drawGrassTuft(x, y) {
  ctx.save();
  ctx.strokeStyle = "rgba(45, 100, 20, 0.7)";
  ctx.lineWidth = 1.5 / camera.zoom;
  ctx.beginPath();
  ctx.moveTo(x, y + 6);
  ctx.lineTo(x - 4, y - 3);
  ctx.moveTo(x, y + 6);
  ctx.lineTo(x, y - 5);
  ctx.moveTo(x, y + 6);
  ctx.lineTo(x + 5, y - 2);
  ctx.stroke();
  ctx.restore();
}

function drawTriangle(x, y, halfWidth, height) {
  ctx.beginPath();
  ctx.moveTo(x, y - height / 2);
  ctx.lineTo(x - halfWidth, y + height / 2);
  ctx.lineTo(x + halfWidth, y + height / 2);
  ctx.closePath();
  ctx.fill();
}

function drawCircle(x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

function drawEllipse(x, y, radiusX, radiusY) {
  ctx.beginPath();
  ctx.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
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
