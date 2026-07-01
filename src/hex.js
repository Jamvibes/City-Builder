import { centerX, centerY, hexSize } from "./state.js";

export function hexToPixel(q, r) {
  const x = hexSize * Math.sqrt(3) * (q + r / 2) + centerX;
  const y = hexSize * 1.5 * r + centerY;
  return { x, y };
}

export function pixelToHex(x, y) {
  x -= centerX;
  y -= centerY;

  const q = (Math.sqrt(3) / 3 * x - 1 / 3 * y) / hexSize;
  const r = (2 / 3 * y) / hexSize;

  return roundHex(q, r);
}

function roundHex(q, r) {
  let x = q;
  let z = r;
  let y = -x - z;

  let rx = Math.round(x);
  let ry = Math.round(y);
  let rz = Math.round(z);

  const xDiff = Math.abs(rx - x);
  const yDiff = Math.abs(ry - y);
  const zDiff = Math.abs(rz - z);

  if (xDiff > yDiff && xDiff > zDiff) {
    rx = -ry - rz;
  } else if (yDiff > zDiff) {
    ry = -rx - rz;
  } else {
    rz = -rx - ry;
  }

  return { q: rx, r: rz };
}

export function getHexCorners(x, y) {
  const corners = [];

  for (let i = 0; i < 6; i++) {
    const angle = Math.PI / 180 * (60 * i - 30);
    corners.push({
      x: x + hexSize * Math.cos(angle),
      y: y + hexSize * Math.sin(angle)
    });
  }

  return corners;
}
