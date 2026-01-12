import {
    Dish, DishTexture, DishTemperature, DishHomogeneity,
    Ingredient, CookingActionType
} from '../../types/cooking';

// ===== DISH SERVICE =====
// Handles all live dish state mutations.

/**
 * Creates a new empty dish ready for cooking.
 */
export function createDish(): Dish {
    return {
        ingredients: [],
        texture: 'liquid', // starts as nothing, first ingredient sets base
        temperature: 'cold',
        homogeneity: 'low',
        complexity: 0,
        status: 'preparing',
        actionHistory: [],
    };
}

/**
 * Adds an ingredient to the dish and recalculates state.
 */
export function addIngredient(dish: Dish, ingredient: Ingredient): Dish {
    const newIngredients = [...dish.ingredients, ingredient];
    const newComplexity = dish.complexity + ingredient.complexity;

    // Recalculate texture based on ingredients
    const newTexture = calculateTexture(newIngredients);

    return {
        ...dish,
        ingredients: newIngredients,
        complexity: newComplexity,
        texture: newTexture,
        // Reset homogeneity when adding new ingredient
        homogeneity: dish.homogeneity === 'high' ? 'medium' : 'low',
    };
}

/**
 * Calculates texture based on ingredient mix.
 */
function calculateTexture(ingredients: Ingredient[]): DishTexture {
    if (ingredients.length === 0) return 'liquid';

    const textures = ingredients.map(i => i.baseTexture);
    const groups = ingredients.map(i => i.group);

    const hasLiquid = textures.includes('liquid');
    const hasSolid = textures.includes('solid');
    const hasSoft = textures.includes('soft');

    // Strange combinations
    const hasProtein = groups.includes('protein');
    const hasFruit = groups.includes('fruit');
    if (hasProtein && hasFruit && ingredients.length >= 3) {
        return 'strange'; // Weird mix without proper cooking
    }

    // Normal texture calculation
    if (hasLiquid && hasSolid) return 'pasty';
    if (hasLiquid && hasSoft) return 'creamy';
    if (hasSolid && !hasLiquid) return 'solid';
    if (hasSoft && !hasSolid) return 'creamy';
    if (hasLiquid) return 'liquid';

    return 'pasty'; // Default mixed
}

/**
 * Applies a cooking action to the dish.
 */
export function applyAction(dish: Dish, action: CookingActionType): Dish {
    if (dish.status === 'burned' || dish.status === 'failed') {
        return dish; // Can't modify a ruined dish
    }

    const newHistory = [...dish.actionHistory, action];
    let newDish = { ...dish, actionHistory: newHistory };

    switch (action) {
        case 'MIX':
            newDish = applyMix(newDish);
            break;
        case 'BEAT':
            newDish = applyBeat(newDish);
            break;
        case 'COOK':
            newDish = applyCook(newDish);
            break;
        case 'COOL':
            newDish = applyCool(newDish);
            break;
        case 'SEASON':
            newDish = applySeason(newDish);
            break;
    }

    return newDish;
}

// --- Action Implementations ---

function applyMix(dish: Dish): Dish {
    // Mixing increases homogeneity
    const homogeneityMap: Record<DishHomogeneity, DishHomogeneity> = {
        low: 'medium',
        medium: 'high',
        high: 'high',
    };

    // If texture was strange AND we mix well, it can become pasty
    let newTexture = dish.texture;
    if (dish.texture === 'strange' && dish.homogeneity === 'low') {
        newTexture = 'pasty';
    }

    return {
        ...dish,
        homogeneity: homogeneityMap[dish.homogeneity],
        texture: newTexture,
    };
}

function applyBeat(dish: Dish): Dish {
    // Beating makes texture smoother and adds complexity
    const textureMap: Record<DishTexture, DishTexture> = {
        solid: 'pasty',
        pasty: 'creamy',
        creamy: 'liquid',
        liquid: 'liquid',
        strange: 'strange', // Can't fix strange by beating
    };

    return {
        ...dish,
        texture: textureMap[dish.texture],
        complexity: dish.complexity + 1,
    };
}

function applyCook(dish: Dish): Dish {
    // Cooking increases temperature
    const tempMap: Record<DishTemperature, DishTemperature> = {
        cold: 'warm',
        warm: 'hot',
        hot: 'burning',
        burning: 'burning',
    };

    const newTemp = tempMap[dish.temperature];

    // Check for burning
    if (newTemp === 'burning' && dish.temperature === 'hot') {
        return {
            ...dish,
            temperature: 'burning',
            status: 'burned',
        };
    }

    // Cooking can fix "strange" texture if done properly
    let newTexture = dish.texture;
    if (dish.texture === 'strange' && dish.homogeneity !== 'low') {
        newTexture = 'pasty';
    }

    return {
        ...dish,
        temperature: newTemp,
        texture: newTexture,
    };
}

function applyCool(dish: Dish): Dish {
    // Cooling decreases temperature
    const tempMap: Record<DishTemperature, DishTemperature> = {
        burning: 'hot',
        hot: 'warm',
        warm: 'cold',
        cold: 'cold',
    };

    return {
        ...dish,
        temperature: tempMap[dish.temperature],
    };
}

function applySeason(dish: Dish): Dish {
    // Seasoning adds complexity and slight quality boost
    return {
        ...dish,
        complexity: dish.complexity + 1,
    };
}

/**
 * Marks dish as ready for serving.
 */
export function finishDish(dish: Dish): Dish {
    if (dish.status === 'burned') return dish;
    if (dish.ingredients.length === 0) {
        return { ...dish, status: 'failed' };
    }

    return {
        ...dish,
        status: 'ready',
    };
}

/**
 * Generates a unique signature for recipe discovery.
 */
export function getDishSignature(dish: Dish): string {
    const sortedIngredients = [...dish.ingredients]
        .map(i => i.id)
        .sort()
        .join(',');
    const actions = dish.actionHistory.join(',');
    return `${sortedIngredients}|${actions}`;
}
