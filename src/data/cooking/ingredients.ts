import { Ingredient } from '../../types/cooking';

// ===== INGREDIENT DATABASE =====
// All ingredients available in the game. Phase restrictions handled at evaluation time.

export const INGREDIENTS: Record<string, Ingredient> = {
    // --- LIQUIDS ---
    milk: {
        id: 'milk', name: 'Leite', icon: '🥛',
        group: 'liquid', baseTexture: 'liquid', complexity: 1, acceptedPhases: [1, 2, 3, 4, 5]
    },
    water: {
        id: 'water', name: 'Água', icon: '💧',
        group: 'liquid', baseTexture: 'liquid', complexity: 1, acceptedPhases: [1, 2, 3, 4, 5]
    },
    broth: {
        id: 'broth', name: 'Caldo', icon: '🥣',
        group: 'liquid', baseTexture: 'liquid', complexity: 2, acceptedPhases: [2, 3, 4, 5]
    },
    yogurt: {
        id: 'yogurt', name: 'Iogurte', icon: '🥛',
        group: 'liquid', baseTexture: 'soft', complexity: 2, acceptedPhases: [1, 2, 3, 4, 5]
    },

    // --- FRUITS ---
    banana: {
        id: 'banana', name: 'Banana', icon: '🍌',
        group: 'fruit', baseTexture: 'soft', complexity: 1, acceptedPhases: [1, 2, 3, 4, 5]
    },
    apple: {
        id: 'apple', name: 'Maçã', icon: '🍎',
        group: 'fruit', baseTexture: 'solid', complexity: 2, acceptedPhases: [1, 2, 3, 4, 5]
    },
    strawberry: {
        id: 'strawberry', name: 'Morango', icon: '🍓',
        group: 'fruit', baseTexture: 'soft', complexity: 2, acceptedPhases: [2, 3, 4, 5]
    },
    mango: {
        id: 'mango', name: 'Manga', icon: '🥭',
        group: 'fruit', baseTexture: 'soft', complexity: 2, acceptedPhases: [2, 3, 4, 5]
    },
    pear: {
        id: 'pear', name: 'Pera', icon: '🍐',
        group: 'fruit', baseTexture: 'soft', complexity: 1, acceptedPhases: [1, 2, 3, 4, 5]
    },

    // --- VEGETABLES ---
    carrot: {
        id: 'carrot', name: 'Cenoura', icon: '🥕',
        group: 'vegetable', baseTexture: 'solid', complexity: 2, acceptedPhases: [1, 2, 3, 4, 5]
    },
    potato: {
        id: 'potato', name: 'Batata', icon: '🥔',
        group: 'vegetable', baseTexture: 'solid', complexity: 2, acceptedPhases: [2, 3, 4, 5]
    },
    pumpkin: {
        id: 'pumpkin', name: 'Abóbora', icon: '🎃',
        group: 'vegetable', baseTexture: 'solid', complexity: 2, acceptedPhases: [1, 2, 3, 4, 5]
    },
    broccoli: {
        id: 'broccoli', name: 'Brócolis', icon: '🥦',
        group: 'vegetable', baseTexture: 'solid', complexity: 3, acceptedPhases: [3, 4, 5]
    },
    corn: {
        id: 'corn', name: 'Milho', icon: '🌽',
        group: 'vegetable', baseTexture: 'solid', complexity: 2, acceptedPhases: [2, 3, 4, 5]
    },
    peas: {
        id: 'peas', name: 'Ervilha', icon: '🟢',
        group: 'vegetable', baseTexture: 'soft', complexity: 2, acceptedPhases: [2, 3, 4, 5]
    },

    // --- PROTEINS ---
    chicken: {
        id: 'chicken', name: 'Frango', icon: '🍗',
        group: 'protein', baseTexture: 'solid', complexity: 3, acceptedPhases: [2, 3, 4, 5]
    },
    fish: {
        id: 'fish', name: 'Peixe', icon: '🐟',
        group: 'protein', baseTexture: 'soft', complexity: 3, acceptedPhases: [2, 3, 4, 5]
    },
    egg: {
        id: 'egg', name: 'Ovo', icon: '🥚',
        group: 'protein', baseTexture: 'liquid', complexity: 2, acceptedPhases: [3, 4, 5]
    },
    meat: {
        id: 'meat', name: 'Carne', icon: '🥩',
        group: 'protein', baseTexture: 'solid', complexity: 4, acceptedPhases: [4, 5]
    },
    cheese: {
        id: 'cheese', name: 'Queijo', icon: '🧀',
        group: 'protein', baseTexture: 'soft', complexity: 2, acceptedPhases: [2, 3, 4, 5]
    },

    // --- EXTRAS ---
    honey: {
        id: 'honey', name: 'Mel', icon: '🍯',
        group: 'extra', baseTexture: 'liquid', complexity: 1, acceptedPhases: [1, 2, 3, 4, 5]
    },
    oats: {
        id: 'oats', name: 'Aveia', icon: '🌾',
        group: 'extra', baseTexture: 'solid', complexity: 1, acceptedPhases: [1, 2, 3, 4, 5]
    },
    rice: {
        id: 'rice', name: 'Arroz', icon: '🍚',
        group: 'extra', baseTexture: 'solid', complexity: 2, acceptedPhases: [3, 4, 5]
    },
    pasta: {
        id: 'pasta', name: 'Macarrão', icon: '🍝',
        group: 'extra', baseTexture: 'solid', complexity: 3, acceptedPhases: [4, 5]
    },
    herbs: {
        id: 'herbs', name: 'Ervas', icon: '🌿',
        group: 'extra', baseTexture: 'solid', complexity: 2, acceptedPhases: [3, 4, 5]
    },
    salt: {
        id: 'salt', name: 'Sal', icon: '🧂',
        group: 'extra', baseTexture: 'solid', complexity: 1, acceptedPhases: [2, 3, 4, 5]
    },
};

// Helper to get all ingredients as array
export const ALL_INGREDIENTS = Object.values(INGREDIENTS);
