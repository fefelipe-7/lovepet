// ===== COOKING SYSTEM v2: EXPERIMENTAL DISCOVERY =====

// --- Ingredient (Static Data) ---
export type IngredientGroup = 'fruit' | 'vegetable' | 'protein' | 'liquid' | 'extra';
export type BaseTexture = 'solid' | 'soft' | 'liquid';

export interface Ingredient {
    id: string;
    name: string;
    icon: string;
    group: IngredientGroup;
    baseTexture: BaseTexture;
    complexity: number; // 1-5
    acceptedPhases: number[]; // [1, 2, 3, 4, 5]
}

// --- Dish (Live Mutable State) ---
export type DishTexture = 'liquid' | 'creamy' | 'pasty' | 'solid' | 'strange';
export type DishTemperature = 'cold' | 'warm' | 'hot' | 'burning';
export type DishHomogeneity = 'low' | 'medium' | 'high';
export type DishStatus = 'preparing' | 'ready' | 'burned' | 'failed';

export interface Dish {
    ingredients: Ingredient[];
    texture: DishTexture;
    temperature: DishTemperature;
    homogeneity: DishHomogeneity;
    complexity: number;
    status: DishStatus;
    actionHistory: CookingActionType[];
}

// --- Cooking Actions ---
export type CookingActionType = 'MIX' | 'BEAT' | 'COOK' | 'COOL' | 'SEASON';

export interface CookingAction {
    type: CookingActionType;
    label: string;
    icon: string;
}

export const COOKING_ACTIONS: CookingAction[] = [
    { type: 'MIX', label: 'Misturar', icon: '🥄' },
    { type: 'BEAT', label: 'Bater', icon: '🌪️' },
    { type: 'COOK', label: 'Cozinhar', icon: '🔥' },
    { type: 'COOL', label: 'Esfriar', icon: '❄️' },
    { type: 'SEASON', label: 'Temperar', icon: '🧂' },
];

// --- Evaluation Result ---
export interface EvaluationResult {
    accepted: boolean;
    reason?: 'burned' | 'weird_texture' | 'too_complex' | 'ingredient_not_for_phase' | 'empty';
    quality?: number; // 1-5 stars
}

// --- Discovered Recipe ---
export interface DiscoveredRecipe {
    id: string; // hash
    name: string;
    ingredientIds: string[];
    actions: CookingActionType[];
    discoveredAtPhase: number;
    quality: number;
    discoveredAt: number; // timestamp
}

// --- Phase Complexity Limits ---
// Phase 1 (Newborn) = max 4, Phase 5 (Teen) = max 15
export const PHASE_COMPLEXITY_LIMITS: Record<number, number> = {
    1: 4,
    2: 6,
    3: 8,
    4: 10,
    5: 15,
};
