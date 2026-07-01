export const terrainTypes = {
  grassland: {
    name: "Grassland",
    label: "G",
    colour: "#C9E86A",
    textColour: "#243000"
  },
  water: {
    name: "Water",
    label: "W",
    colour: "#1E88E5",
    textColour: "#fff"
  },
  forest: {
    name: "Forest",
    label: "Fo",
    colour: "#1B5E20",
    textColour: "#fff"
  },
  mountain: {
    name: "Mountain",
    label: "Mt",
    colour: "#795548",
    textColour: "#fff"
  }
};

export const tileTypes = {
  townCentre: {
    name: "Town Centre",
    label: "TC",
    colour: "#d9a441",
    rarity: "special",
    baseScore: 5,
    tags: ["civic"],
    description: "The heart of your settlement.",
    upgradesTo: [],
    allowedTerrain: ["grassland"],
    resources: { food: 0, wood: 0, stone: 0, gold: 1, population: 0 }
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
    allowedTerrain: ["grassland", "forest"],
    resources: { food: 0, wood: 0, stone: 0, gold: 0, population: 5 }
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
    allowedTerrain: ["grassland", "forest"],
    resources: { food: 0, wood: 0, stone: 0, gold: 1, population: 8 }
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
    allowedTerrain: ["grassland"],
    resources: { food: 0, wood: 0, stone: 0, gold: 1, population: 12 }
  },
  farm: {
    name: "Farm",
    label: "F",
    colour: "#90EE90",
    rarity: "common",
    baseScore: 1,
    tags: ["food", "rural"],
    description: "Provides food and supports nearby houses. Three connected Farms can evolve the newly placed Farm into a Windmill.",
    upgradesTo: ["orchard", "ranch"],
    allowedTerrain: ["grassland"],
    resources: { food: 2, wood: 0, stone: 0, gold: 0, population: 0 }
  },
  orchard: {
    name: "Orchard",
    label: "O",
    colour: "#7DCEA0",
    rarity: "uncommon",
    baseScore: 3,
    tags: ["food", "nature"],
    description: "An upgraded farm. Benefits from nearby forest terrain.",
    upgradesTo: [],
    allowedTerrain: ["grassland", "forest"],
    resources: { food: 3, wood: 1, stone: 0, gold: 0, population: 0 }
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
    allowedTerrain: ["grassland"],
    resources: { food: 3, wood: 0, stone: 0, gold: 0, population: 0 }
  },
  windmill: {
    name: "Windmill",
    label: "WM",
    colour: "#F2D16B",
    rarity: "evolved",
    baseScore: 5,
    tags: ["food", "rural", "evolved"],
    description: "Created when a newly placed Farm completes a connected group of three Farms. Boosts food and generates gold.",
    upgradesTo: [],
    allowedTerrain: ["grassland"],
    resources: { food: 4, wood: 0, stone: 0, gold: 1, population: 0 }
  },
  woodcutter: {
    name: "Woodcutter",
    label: "Wc",
    colour: "#8D6E63",
    rarity: "common",
    baseScore: 1,
    tags: ["wood", "industry"],
    description: "Harvests wood. Best placed on forest terrain.",
    upgradesTo: ["lumberCamp", "sawmill"],
    allowedTerrain: ["forest"],
    resources: { food: 0, wood: 2, stone: 0, gold: 0, population: 0 }
  },
  lumberCamp: {
    name: "Lumber Camp",
    label: "LC",
    colour: "#6D4C41",
    rarity: "uncommon",
    baseScore: 3,
    tags: ["wood", "industry"],
    description: "An upgraded woodcutter that produces more timber.",
    upgradesTo: [],
    allowedTerrain: ["forest"],
    resources: { food: 0, wood: 4, stone: 0, gold: 0, population: 0 }
  },
  sawmill: {
    name: "Sawmill",
    label: "SM",
    colour: "#5D4037",
    rarity: "rare",
    baseScore: 5,
    tags: ["wood", "industry", "rare"],
    description: "Processes timber efficiently and generates gold.",
    upgradesTo: [],
    allowedTerrain: ["forest", "water"],
    resources: { food: 0, wood: 5, stone: 0, gold: 1, population: 0 }
  },
  mine: {
    name: "Mine",
    label: "M",
    colour: "#A9A9A9",
    rarity: "common",
    baseScore: 2,
    tags: ["industry"],
    description: "Scores well away from houses and near mountains. Three Mines in a triangle plus 20 gold can awaken a Dragon's Lair.",
    upgradesTo: ["quarry", "deepMine"],
    allowedTerrain: ["mountain"],
    resources: { food: 0, wood: 0, stone: 1, gold: 0, population: 0 }
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
    allowedTerrain: ["mountain"],
    resources: { food: 0, wood: 0, stone: 3, gold: 0, population: 0 }
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
    allowedTerrain: ["mountain"],
    resources: { food: 0, wood: 0, stone: 4, gold: 2, population: 0 }
  },
  dragonLair: {
    name: "Dragon's Lair",
    label: "DL",
    colour: "#7B1FA2",
    rarity: "legendary",
    baseScore: 30,
    tags: ["industry", "mythic", "victory"],
    description: "Created when a newly placed Mine completes a triangle of three Mines while you have at least 20 gold.",
    upgradesTo: [],
    allowedTerrain: ["mountain"],
    resources: { food: 0, wood: 0, stone: 0, gold: 5, population: 0 }
  }
};

export const tileBag = Object.keys(tileTypes).filter(tile => tileTypes[tile].rarity === "common");

export function getTileLabel(type) {
  return tileTypes[type]?.label ?? "";
}

export function getTileName(type) {
  return tileTypes[type]?.name ?? type;
}

export function getTerrainName(type) {
  return terrainTypes[type]?.name ?? type;
}
