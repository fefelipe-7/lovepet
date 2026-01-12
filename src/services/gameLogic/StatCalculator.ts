import { ItemEffects, PetState } from '../../types';

export class StatCalculator {
    /**
     * Calculates the new state of the pet after applying item effects.
     * Allows for complex logic like diminishing returns, caps, and boosts.
     * 
     * @param currentPet The current state of the pet.
     * @param effects The base effects of the item.
     * @returns The updated PetState.
     */
    static calculate(currentPet: PetState, effects: ItemEffects): PetState {
        const applyChange = (current: number, change: number | undefined) => {
            if (!change) return current;

            // LOGIC: Diminishing returns example (optional, can be toggled)
            // If the stat is already high (> 90) and we are adding, we only add 50%
            let effectiveChange = change;
            if (change > 0 && current > 90) {
                effectiveChange = Math.ceil(change * 0.5);
            }

            return Math.max(0, Math.min(100, current + effectiveChange));
        };

        // Logic specifics for each stat can be added here
        const newHunger = applyChange(currentPet.hunger, effects.hunger);
        const newEnergy = applyChange(currentPet.energy, effects.energy);
        const newCleanliness = applyChange(currentPet.cleanliness, effects.cleanliness);
        const newHappiness = applyChange(currentPet.happiness, effects.happiness);

        const bonusSatisfaction = effects.satisfaction || 0;
        const newSatisfaction = applyChange(currentPet.satisfaction, bonusSatisfaction);

        return {
            ...currentPet,
            hunger: newHunger,
            energy: newEnergy,
            cleanliness: newCleanliness,
            happiness: newHappiness,
            satisfaction: newSatisfaction
        };
    }
}
