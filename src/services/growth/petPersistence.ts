import { GrowthPet, createDefaultGrowthPet } from '../../types/growth';

// ===== PET PERSISTENCE SERVICE =====
// Handles saving/loading pet state to localStorage

const STORAGE_KEY = 'lovepet_growth_pet';

/**
 * Gets pet from storage or creates default.
 */
export function loadPet(): GrowthPet {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch {
        console.warn('Failed to load pet');
    }
    return createDefaultGrowthPet();
}

/**
 * Saves pet to storage.
 */
export function savePet(pet: GrowthPet): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(pet));
    } catch {
        console.warn('Failed to save pet');
    }
}

/**
 * Resets pet to default (for testing).
 */
export function resetPet(): GrowthPet {
    const newPet = createDefaultGrowthPet();
    savePet(newPet);
    return newPet;
}
