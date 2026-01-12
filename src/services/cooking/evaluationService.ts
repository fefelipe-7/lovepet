import { Dish, EvaluationResult, PHASE_COMPLEXITY_LIMITS } from '../../types/cooking';

// ===== EVALUATION SERVICE =====
// Determines if pet will accept the dish.

/**
 * Evaluates a dish against pet's phase limits.
 * Returns whether pet accepts and why/why not.
 */
export function evaluateDish(dish: Dish, petPhase: number): EvaluationResult {
    // 1. Empty dish
    if (dish.ingredients.length === 0) {
        return { accepted: false, reason: 'empty' };
    }

    // 2. Burned dish
    if (dish.status === 'burned') {
        return { accepted: false, reason: 'burned' };
    }

    // 3. Strange texture (not fixed during cooking)
    if (dish.texture === 'strange') {
        return { accepted: false, reason: 'weird_texture' };
    }

    // 4. Complexity check
    const phaseLimit = PHASE_COMPLEXITY_LIMITS[petPhase] || 4;
    if (dish.complexity > phaseLimit) {
        return { accepted: false, reason: 'too_complex' };
    }

    // 5. Ingredient phase compatibility
    for (const ingredient of dish.ingredients) {
        if (!ingredient.acceptedPhases.includes(petPhase)) {
            return { accepted: false, reason: 'ingredient_not_for_phase' };
        }
    }

    // 6. All checks passed!
    const quality = calculateQuality(dish);
    return { accepted: true, quality };
}

/**
 * Calculates quality (1-5 stars) based on dish state.
 */
function calculateQuality(dish: Dish): number {
    let score = 3; // Base score

    // Homogeneity bonus
    if (dish.homogeneity === 'high') score += 1;
    if (dish.homogeneity === 'low') score -= 1;

    // Temperature bonus (warm/hot is ideal)
    if (dish.temperature === 'warm' || dish.temperature === 'hot') score += 1;
    if (dish.temperature === 'cold') score -= 1;

    // Texture bonus
    if (dish.texture === 'creamy') score += 1;

    // Clamp to 1-5
    return Math.max(1, Math.min(5, score));
}

/**
 * Generates a cute pet reaction message based on result.
 */
export function getPetReaction(result: EvaluationResult): string {
    if (result.accepted) {
        if (result.quality && result.quality >= 4) {
            return 'HMMM delícia!! ⭐⭐⭐⭐⭐';
        }
        if (result.quality && result.quality >= 3) {
            return 'que gostoso! 😋';
        }
        return 'obrigado pela comidinha! 🥰';
    }

    switch (result.reason) {
        case 'burned':
            return 'ugh... tá queimado! 😫🔥';
        case 'weird_texture':
            return 'isso parece... estranho? 🤢';
        case 'too_complex':
            return 'isso é muito difícil pra mim ainda... 😅';
        case 'ingredient_not_for_phase':
            return 'acho que não posso comer isso ainda... 🥺';
        case 'empty':
            return 'hã? cadê a comida? 😶';
        default:
            return 'não sei... 🤔';
    }
}
