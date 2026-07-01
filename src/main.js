import { canvas, gameState } from "./state.js";
import { pixelToHex } from "./hex.js";
import { placeTile } from "./placement.js";
import { draw } from "./renderer.js";
import { drawRandomOptions } from "./tileOptions.js";
import { updateHud } from "./hud.js";

canvas.addEventListener("click", event => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;
  const hex = pixelToHex(mouseX, mouseY);

  placeTile(hex.q, hex.r, gameState.selectedTile);
});

drawRandomOptions();
draw();
updateHud();
