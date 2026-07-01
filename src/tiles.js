export const terrainTypes = {
  grassland: {
    name: "Grassland",
    label: "G",
    colour: "#98FF98",
    textColour: "#333"
  },
  water: {
    name: "Water",
    label: "W",
    colour: "#4A90E2",
    textColour: "#fff"
  },
  forest: {
    name: "Forest",
    label: "Fo",
    colour: "#2D5016",
    textColour: "#fff"
  },
  mountain: {
    name: "Mountain",
    label: "Mt",
    colour: "#8B7355",
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
    resources: { food: 0, wood: 0, stone: 0, gold: 1, population: 12 }
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
    resources: { food: 2, wood: 0, stone: 0, gold: 0, population: 0 }
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
    resources: { food: 3, wood: 0, stone: 0, gold: 0, population: 0 }
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
    resources: { food: 0, wood: 2, stone: 0, gold: 0, population: 0 }
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
    resources: { food: 0, wood: 4, stone: 0, gold: 1, population: 0 }
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
    resources: { food: 0, wood: 0, stone: 4, gold: 2, population: 0 }
  }
};

export const tileBag = Object.keys(tileTypes).filter(tile => tileTypes[tile].rarity === "common");

export function getTileLabel(type) {
  return tileTypes[type]?.label ?? "";
}

export function getTileName(type) {
  return tileTypes[type]?.name ?? type;
}
