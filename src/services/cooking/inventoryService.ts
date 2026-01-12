import { DiscoveredRecipe } from '../../types/cooking';
import { GameItem } from '../../types';

// ===== INVENTORY SERVICE =====
// Tracks cooked food items with quantities.

const STORAGE_KEY = 'lovepet_food_inventory';

export interface InventoryItem {
    recipeId: string;
    name: string;
    icon: string;
    quantity: number;
    effects: {
        hunger: number;
        happiness: number;
        satisfaction: number;
    };
}

/**
 * Gets the current food inventory.
 */
export function getInventory(): InventoryItem[] {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch {
        console.warn('Failed to load inventory');
    }
    return [];
}

/**
 * Saves inventory to storage.
 */
function saveInventory(inventory: InventoryItem[]): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(inventory));
    } catch {
        console.warn('Failed to save inventory');
    }
}

/**
 * Adds a cooked dish to inventory (or increments quantity if exists).
 */
export function addToInventory(recipe: DiscoveredRecipe, quality: number): void {
    const inventory = getInventory();

    const existingIndex = inventory.findIndex(i => i.recipeId === recipe.id);

    if (existingIndex >= 0) {
        // Increment quantity
        inventory[existingIndex].quantity += 1;
    } else {
        // Add new item
        const newItem: InventoryItem = {
            recipeId: recipe.id,
            name: recipe.name,
            icon: '🍽️', // Default icon for cooked food
            quantity: 1,
            effects: {
                hunger: 10 + (quality * 5),
                happiness: quality * 3,
                satisfaction: quality * 2,
            }
        };
        inventory.push(newItem);
    }

    saveInventory(inventory);
}

/**
 * Consumes one item from inventory. Returns the item if successful, null if not available.
 */
export function consumeFromInventory(recipeId: string): InventoryItem | null {
    const inventory = getInventory();
    const itemIndex = inventory.findIndex(i => i.recipeId === recipeId);

    if (itemIndex < 0 || inventory[itemIndex].quantity <= 0) {
        return null;
    }

    const item = { ...inventory[itemIndex] };
    inventory[itemIndex].quantity -= 1;

    // Remove if quantity is 0
    if (inventory[itemIndex].quantity <= 0) {
        inventory.splice(itemIndex, 1);
    }

    saveInventory(inventory);
    return item;
}

/**
 * Converts inventory items to GameItems for ActionPanel.
 */
export function getInventoryAsGameItems(): GameItem[] {
    const inventory = getInventory();

    return inventory.map(item => ({
        id: item.recipeId,
        name: `${item.name} (${item.quantity})`,
        icon: item.icon,
        actionText: `dar ${item.name.toLowerCase()}`,
        type: 'FEED' as const,
        effects: item.effects,
    }));
}

/**
 * Clears inventory (for testing).
 */
export function clearInventory(): void {
    localStorage.removeItem(STORAGE_KEY);
}
