import { camera, ctx } from "./state.js";
import { getHexCorners, hexToPixel } from "./hex.js";
import { getValidPlacementSpots } from "./placementRules.js";

export function drawValidPlacementHighlights() {
  const validSpots = getValidPlacementSpots();

  ctx.save();
  ctx.translate(camera.x, camera.y);
  ctx.scale(camera.zoom, camera.zoom);

  validSpots.forEach(spot => {
    drawHighlightHex(spot.q, spot.r);
  });

  ctx.restore();
}

function drawHighlightHex(q, r) {
  const position = hexToPixel(q, r);
  const corners = getHexCorners(position.x, position.y);

  ctx.beginPath();
  ctx.moveTo(corners[0].x, corners[0].y);

  for (let i = 1; i < corners.length; i++) {
    ctx.lineTo(corners[i].x, corners[i].y);
  }

  ctx.closePath();

  ctx.save();
  ctx.fillStyle = "rgba(255, 235, 59, 0.18)";
  ctx.fill();

  ctx.shadowColor = "rgba(255, 235, 59, 0.9)";
  ctx.shadowBlur = 16 / camera.zoom;
  ctx.strokeStyle = "#ffeb3b";
  ctx.lineWidth = 5 / camera.zoom;
  ctx.stroke();

  ctx.shadowBlur = 0;
  ctx.strokeStyle = "#111";
  ctx.lineWidth = 1.5 / camera.zoom;
  ctx.setLineDash([7 / camera.zoom, 5 / camera.zoom]);
  ctx.stroke();
  ctx.restore();
}
