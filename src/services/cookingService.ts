import { Recipe, CookingStep, CookingAction } from '../types/cooking';
import { PetState, GameItem } from '../types';
import { RECIPES } from '../data/cooking/recipes';

interface KitchenState {
    recipe: Recipe | null;
    currentStepIndex: number;
    currentProgress: number; // 0-100 for duration, or 0-targetClicks
    isCooking: boolean;
    isFinished: boolean;
    failed: boolean;
}

export class CookingService {
    // Determine available recipes based on Pet Stage
    static getAvailableRecipes(pet: PetState): Recipe[] {
        // Simple filter logic for now
        // In reality we would map Age -> Stage
        // For simplicity: access all recipes up to TEEN if age is high enough
        // or just show based on hardcoded stage in this prototype
        return RECIPES;
    }

    static canCook(recipe: Recipe, pet: PetState): boolean {
        // Check if pet is old enough for this stage
        // Also check if we have ingredients (assumed infinite for now)
        return true;
    }
}
