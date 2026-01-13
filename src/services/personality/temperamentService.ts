import { Temperamento, gerarTemperamento, clamp } from '../../types/personality';

// ===== TEMPERAMENT SERVICE =====
// Generates temperament at birth, applies minimal modifications

const STORAGE_KEY = 'lovepet_temperamento';

/**
 * Loads temperament from storage or generates new one.
 */
export function loadTemperamento(): Temperamento {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch {
        console.warn('Failed to load temperamento');
    }
    // Generate new temperament
    const novo = gerarTemperamento();
    saveTemperamento(novo);
    return novo;
}

/**
 * Saves temperament to storage.
 */
export function saveTemperamento(temp: Temperamento): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(temp));
    } catch {
        console.warn('Failed to save temperamento');
    }
}

/**
 * Applies minimal modification to temperament (max ±5 over entire game).
 * Returns new temperament if changed, null otherwise.
 */
export function modificarTemperamentoLeve(
    temp: Temperamento,
    trait: keyof Temperamento,
    delta: number
): Temperamento {
    // Limit to very small changes
    const limitedDelta = clamp(delta, -1, 1);

    return {
        ...temp,
        [trait]: clamp(temp[trait] + limitedDelta, 0, 100),
    };
}

/**
 * Gets temperament modifier for action effects.
 */
export function getTemperamentoModifier(
    temp: Temperamento,
    baseEffect: number
): number {
    let modifier = 1.0;

    // High sensitivity = more affected
    if (temp.sensibilidadeEmocional > 70) modifier *= 1.3;
    else if (temp.sensibilidadeEmocional < 30) modifier *= 0.8;

    // High intensity = stronger reactions
    if (temp.intensidadeReacao > 70) modifier *= 1.2;
    else if (temp.intensidadeReacao < 30) modifier *= 0.7;

    return modifier;
}

/**
 * Gets temperament description for UI.
 */
export function getTemperamentoDescricao(temp: Temperamento): string[] {
    const desc: string[] = [];

    if (temp.sensibilidadeEmocional > 70) desc.push('sensível');
    else if (temp.sensibilidadeEmocional < 30) desc.push('resiliente');

    if (temp.nivelDeEnergia > 70) desc.push('energético');
    else if (temp.nivelDeEnergia < 30) desc.push('calmo');

    if (temp.adaptabilidade > 70) desc.push('flexível');
    else if (temp.adaptabilidade < 30) desc.push('rotineiro');

    if (temp.intensidadeReacao > 70) desc.push('expressivo');
    else if (temp.intensidadeReacao < 30) desc.push('contido');

    return desc.length > 0 ? desc : ['equilibrado'];
}
