const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");

const hexSize = 40;
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

const placedTiles = {};

// Resource tracking
const resources = {
  food: 0,
  wood: 0,
  stone: 0,
  gold: 0
};

const directions = [
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, 0],
  [-1, 1],
  [0, 1]
];

const tileTypes = {
  townCentre: {
    name: "Town Centre",
    label: "TC",
    colour: "#d9a441",
    rarity: "special",
    baseScore: 5,
    tags: ["civic"],
    description: "The heart of your settlement.",
    upgradesTo: [],
    resources: { food: 0, wood: 0, stone: 0, gold: 1 }
  },

  house: {
    name: "House",
    label: "H",
    colour: "#87CEEB",
    rarity: "common",
    baseScore: 1,
    tags: ["residential"],
    description: "Scores well near farms, parks, and shops.",
    upgradesTo: ["villa", "apartment"],
    resources: { food: 0, wood: 0, stone: 0, gold: 0 }
  },

  villa: {
    name: "Villa",
    label: "V",
    colour: "#5DADE2",
    rarity: "uncommon",
    baseScore: 3,
    tags: ["residential", "luxury"],
    description: "An upgraded house. Scores highly near parks.",
    upgradesTo: [],
    resources: { food: 0, wood: 0, stone: 0, gold: 1 }
  },

  apartment: {
    name: "Apartment",
    label: "A",
    colour: "#3498DB",
    rarity: "uncommon",
    baseScore: 3,
    tags: ["residential", "dense"],
    description: "An upgraded house. Scores highly near shops.",
    upgradesTo: [],
    resources: { food: 0, wood: 0, stone: 0, gold: 1 }
  },

  farm: {
    name: "Farm",
    label: "F",
    colour: "#90EE90",
    rarity: "common",
    baseScore: 1,
    tags: ["food", "rural"],
    description: "Provides food and supports nearby houses.",
    upgradesTo: ["orchard", "ranch"],
    resources: { food: 2, wood: 0, stone: 0, gold: 0 }
  },

  orchard: {
    name: "Orchard",
    label: "O",
    colour: "#7DCEA0",
    rarity: "uncommon",
    baseScore: 3,
    tags: ["food", "nature"],
    description: "An upgraded farm. Benefits from nearby forests.",
    upgradesTo: [],
    resources: { food: 3, wood: 1, stone: 0, gold: 0 }
  },

  ranch: {
    name: "Ranch",
    label: "R",
    colour: "#82E0AA",
    rarity: "uncommon",
    baseScore: 3,
    tags: ["food", "rural"],
    description: "An upgraded farm. Benefits from open space.",
    upgradesTo: [],
    resources: { food: 3, wood: 0, stone: 0, gold: 0 }
  },

  forest: {
    name: "Forest",
    label: "Fo",
    colour: "#228B22",
    rarity: "common",
    baseScore: 1,
    tags: ["nature"],
    description: "Scores well in clusters and beside farms.",
    upgradesTo: ["ancientForest"],
    resources: { food: 0, wood: 2, stone: 0, gold: 0 }
  },

  ancientForest: {
    name: "Ancient Forest",
    label: "AF",
    colour: "#145A32",
    rarity: "rare",
    baseScore: 5,
    tags: ["nature", "rare"],
    description: "An upgraded forest with strong nature bonuses.",
    upgradesTo: [],
    resources: { food: 0, wood: 4, stone: 0, gold: 1 }
  },

  mine: {
    name: "Mine",
    label: "M",
    colour: "#A9A9A9",
    rarity: "common",
    baseScore: 2,
    tags: ["industry"],
    description: "Scores well away from houses and near mountains.",
    upgradesTo: ["quarry", "deepMine"],
    resources: { food: 0, wood: 0, stone: 1, gold: 0 }
  },

  quarry: {
    name: "Quarry",
    label: "Q",
    colour: "#808080",
    rarity: "uncommon",
    baseScore: 4,
    tags: ["industry", "stone"],
    description: "An upgraded mine. Provides strong industrial scoring.",
    upgradesTo: [],
    resources: { food: 0, wood: 0, stone: 3, gold: 0 }
  },

  deepMine: {
    name: "Deep Mine",
    label: "DM",
    colour: "#696969",
    rarity: "rare",
    baseScore: 6,
    tags: ["industry", "rare"],
    description: "A powerful upgraded mine.",
    upgradesTo: [],
    resources: { food: 0, wood: 0, stone: 4, gold: 2 }
  }
};

const tileBag = Object.keys(tileTypes).filter(tile => {
  return tileTypes[tile].rarity === "common";
});

let currentOptions = [];
let selectedTile = null;

// Start with town centre
placedTiles["0,0"] = {
  q: 0,
  r: 0,
  type: "townCentre"
};

// Initialize resources from starting tile
resources.gold += tileTypes.townCentre.resources.gold;

function hexToPixel(q, r) {
  const x = hexSize * Math.sqrt(3) * (q + r / 2) + centerX;
  const y = hexSize * 1.5 * r + centerY;
  return { x, y };
}

function updateTileOptionsUI() {
  const optionsDiv = document.getElementById("tileOptions");
  optionsDiv.innerHTML = "";

  currentOptions.forEach(tile => {
    const button = document.createElement("button");
    button.textContent = tile;

    if (tile === selectedTile) {
      button.style.fontWeight = "bold";
      button.style.border = "3px solid black";
    }

    button.onclick = () => {
      selectedTile = tile;
      updateTileOptionsUI();
    };

    optionsDiv.appendChild(button);
  });
}

function calculateTotalScore() {
  let total = 0;

  for (const key in placedTiles) {
    const tile = placedTiles[key];

    if (tileTypes[tile.type]) {
      total += tileTypes[tile.type].baseScore;
    }
  }

  return total;
}

function drawRandomOptions() {
  currentOptions = [];

  for (let i = 0; i < 3; i++) {
    const randomTile = tileBag[Math.floor(Math.random() * tileBag.length)];
    currentOptions.push(randomTile);
  }

  selectedTile = currentOptions[0];
  updateTileOptionsUI();
}

function updateScore() {
  scoreElement.textContent = calculateTotalScore();
}

function updateResources() {
  document.getElementById("food").textContent = resources.food;
  document.getElementById("wood").textContent = resources.wood;
  document.getElementById("stone").textContent = resources.stone;
  document.getElementById("gold").textContent = resources.gold;
}

function getHexCorners(x, y) {
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

function drawHex(q, r, type, isValidSpot = false) {
  const { x, y } = hexToPixel(q, r);
  const corners = getHexCorners(x, y);

  ctx.beginPath();
  ctx.moveTo(corners[0].x, corners[0].y);

  for (let i = 1; i < corners.length; i++) {
    ctx.lineTo(corners[i].x, corners[i].y);
  }

  ctx.closePath();

  if (type === "townCentre") {
    ctx.fillStyle = "#d9a441";
  } else if (isValidSpot) {
    ctx.fillStyle = "#cfe8cf";
  } else {
    ctx.fillStyle = "#88c999";
  }

  ctx.fill();
  ctx.strokeStyle = "#333";
  ctx.stroke();

ctx.fillStyle = "#222";
ctx.textAlign = "center";
ctx.textBaseline = "middle";
ctx.font = "bold 18px Arial";

switch (type) {
    case "townCentre":
        ctx.fillText("TC", x, y);
        break;

    case "house":
        ctx.fillText("H", x, y);
        break;

    case "farm":
        ctx.fillText("F", x, y);
        break;

    case "forest":
        ctx.fillText("Fo", x, y);
        break;

    case "mine":
        ctx.fillText("M", x, y);
        break;
}
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

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

function getValidPlacementSpots() {
  const spots = {};

  for (const key in placedTiles) {
    const tile = placedTiles[key];

    for (const [dq, dr] of directions) {
      const q = tile.q + dq;
      const r = tile.r + dr;
      const newKey = `${q},${r}`;

      if (!placedTiles[newKey]) {
        spots[newKey] = { q, r };
      }
    }
  }

  return Object.values(spots);
}

function canPlaceTile(q, r) {
  const key = `${q},${r}`;

  if (placedTiles[key]) {
    return false;
  }

  return directions.some(([dq, dr]) => {
    const neighbourKey = `${q + dq},${r + dr}`;
    return placedTiles[neighbourKey];
  });
}

function placeTile(q, r, type) {
  if (!canPlaceTile(q, r)) {
    return;
  }

  placedTiles[`${q},${r}`] = {
    q,
    r,
    type
  };

  // Add resources from the placed tile
  const tileResource = tileTypes[type].resources;
  resources.food += tileResource.food;
  resources.wood += tileResource.wood;
  resources.stone += tileResource.stone;
  resources.gold += tileResource.gold;

  drawRandomOptions();
  draw();
  updateResources();
}

function pixelToHex(x, y) {
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

function upgradeTile(q, r, newType) {
  const key = `${q},${r}`;
  const tile = placedTiles[key];

  if (!tile) return;

  const possibleUpgrades = tileTypes[tile.type].upgradesTo;

  if (!possibleUpgrades.includes(newType)) {
    return;
  }

  // Remove old tile resources and add new tile resources
  const oldResources = tileTypes[tile.type].resources;
  const newResources = tileTypes[newType].resources;

  resources.food += newResources.food - oldResources.food;
  resources.wood += newResources.wood - oldResources.wood;
  resources.stone += newResources.stone - oldResources.stone;
  resources.gold += newResources.gold - oldResources.gold;

  tile.type = newType;
  draw();
  updateResources();
}

canvas.addEventListener("click", event => {
  const rect = canvas.getBoundingClientRect();

  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  const hex = pixelToHex(mouseX, mouseY);

  placeTile(hex.q, hex.r, selectedTile);
});

drawRandomOptions();
draw();
updateResources();
