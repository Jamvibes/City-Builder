import { camera, ctx, directions, placedTiles } from "./state.js";
import { getHexCorners, hexToPixel } from "./hex.js";
import { getTerrainAt } from "./terrain.js";
import { terrainSpriteSources } from "./terrainSprites.js";

const terrainSprites = Object.fromEntries(
  Object.entries(terrainSpriteSources).map(([type, source]) => {
    const image = new Image();
    image.src = source;
    return [type, image];
  })
);

export function drawPixelTerrainOverlay() {
  ctx.save();
  ctx.translate(camera.x, camera.y);
  ctx.scale(camera.zoom, camera.zoom);
  ctx.imageSmoothingEnabled = false;

  for (const terrainKey of getVisibleTerrainKeys()) {
    const [q, r] = terrainKey.split(",").map(Number);
    const terrain = getTerrainAt(q, r);
    const sprite = terrainSprites[terrain];

    if (!sprite?.complete || sprite.naturalWidth === 0) continue;

    const { x, y } = hexToPixel(q, r);
    const corners = getHexCorners(x, y);

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(corners[0].x, corners[0].y);
    for (let i = 1; i < corners.length; i++) {
      ctx.lineTo(corners[i].x, corners[i].y);
    }
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(sprite, x - 40, y - 40, 80, 80);
    ctx.restore();

    ctx.beginPath();
    ctx.moveTo(corners[0].x, corners[0].y);
    for (let i = 1; i < corners.length; i++) {
      ctx.lineTo(corners[i].x, corners[i].y);
    }
    ctx.closePath();
    ctx.strokeStyle = "rgba(43, 53, 37, 0.72)";
    ctx.lineWidth = 1.5 / camera.zoom;
    ctx.stroke();
  }

  ctx.restore();
}

function getVisibleTerrainKeys() {
  const visibleTerrainTiles = new Set();

  for (const key in placedTiles) {
    const tile = placedTiles[key];
    for (const [dq, dr] of directions) {
      const terrainKey = `${tile.q + dq},${tile.r + dr}`;
      if (!placedTiles[terrainKey]) visibleTerrainTiles.add(terrainKey);
    }
  }

  return visibleTerrainTiles;
}
