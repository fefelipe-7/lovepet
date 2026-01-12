import { Dish, DiscoveredRecipe, CookingActionType } from '../../types/cooking';
import { getDishSignature } from './dishService';

// ===== RECIPE BOOK SERVICE =====
// Handles discovery and persistence of recipes.

const STORAGE_KEY = 'lovepet_recipe_book';

/**
 * Generates a creative name for the dish based on ingredients.
 */
function generateDishName(dish: Dish): string {
    const primaryIngredient = dish.ingredients[0];
    const secondaryIngredient = dish.ingredients[1];

    if (!primaryIngredient) return 'Prato Misterioso';

    const prefixes = ['Delícia de', 'Creminho de', 'Purê de', 'Sopa de', 'Mix de'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];

    if (secondaryIngredient) {
        return `${prefix} ${primaryIngredient.name} com ${secondaryIngredient.name}`;
    }

    return `${prefix} ${primaryIngredient.name}`;
}

/**
 * Attempts to discover and save a new recipe.
 * Returns the recipe if new, null if already exists.
 */
export function discoverRecipe(dish: Dish, petPhase: number, quality: number): DiscoveredRecipe | null {
    const signature = getDishSignature(dish);
    const existingBook = getRecipeBook();

    // Check if already discovered
    if (existingBook.some(r => r.id === signature)) {
        return null; // Already known
    }

    const newRecipe: DiscoveredRecipe = {
        id: signature,
        name: generateDishName(dish),
        ingredientIds: dish.ingredients.map(i => i.id),
        actions: [...dish.actionHistory],
        discoveredAtPhase: petPhase,
        quality,
        discoveredAt: Date.now(),
    };

    // Save to book
    const updatedBook = [...existingBook, newRecipe];
    saveRecipeBook(updatedBook);

    return newRecipe;
}

/**
 * Gets all discovered recipes from storage.
 */
export function getRecipeBook(): DiscoveredRecipe[] {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch {
        console.warn('Failed to load recipe book from storage');
    }
    return [];
}

/**
 * Saves the recipe book to storage.
 */
function saveRecipeBook(book: DiscoveredRecipe[]): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(book));
    } catch {
        console.warn('Failed to save recipe book to storage');
    }
}

/**
 * Clears all discovered recipes (for testing).
 */
export function clearRecipeBook(): void {
    localStorage.removeItem(STORAGE_KEY);
}
