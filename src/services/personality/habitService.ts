import { Habito, TipoHabito, clamp } from '../../types/personality';

// ===== HABIT SERVICE =====
// Tracks repeated actions and forms habits

const STORAGE_KEY = 'lovepet_habitos';
const REPETITION_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours
const STRENGTH_GAIN = 10;
const STRENGTH_DECAY = 2;

/**
 * Loads habits from storage.
 */
export function loadHabitos(): Habito[] {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch {
        console.warn('Failed to load habitos');
    }
    return [];
}

/**
 * Saves habits to storage.
 */
function saveHabitos(habitos: Habito[]): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(habitos));
    } catch {
        console.warn('Failed to save habitos');
    }
}

/**
 * Records an action, strengthening or creating a habit.
 */
export function registrarAcaoHabito(tipo: TipoHabito): Habito[] {
    const habitos = loadHabitos();
    const now = Date.now();

    const existingIndex = habitos.findIndex(h => h.tipo === tipo);

    if (existingIndex >= 0) {
        // Strengthen existing habit
        const habit = habitos[existingIndex];
        const timeSinceLast = now - habit.ultimaVez;

        // More strength if done within window
        const bonus = timeSinceLast < REPETITION_WINDOW_MS ? 5 : 0;

        habitos[existingIndex] = {
            ...habit,
            forca: clamp(habit.forca + STRENGTH_GAIN + bonus, 0, 100),
            ultimaVez: now,
        };
    } else {
        // Create new habit
        habitos.push({
            tipo,
            forca: STRENGTH_GAIN,
            ultimaVez: now,
        });
    }

    saveHabitos(habitos);
    return habitos;
}

/**
 * Decays habits over time.
 */
export function decairHabitos(minutosPasados: number): Habito[] {
    const habitos = loadHabitos();
    const decayRate = Math.floor(minutosPasados / 60); // Decay per hour

    if (decayRate <= 0) return habitos;

    const decayed = habitos
        .map(h => ({
            ...h,
            forca: clamp(h.forca - STRENGTH_DECAY * decayRate, 0, 100),
        }))
        .filter(h => h.forca > 0); // Remove dead habits

    saveHabitos(decayed);
    return decayed;
}

/**
 * Gets habit multiplier for effects.
 * Strong habits amplify their effects.
 */
export function getHabitoMultiplier(tipo: TipoHabito): number {
    const habitos = loadHabitos();
    const habit = habitos.find(h => h.tipo === tipo);

    if (!habit) return 1.0;

    // 0-100 strength maps to 1.0-1.5 multiplier
    return 1.0 + (habit.forca / 200);
}

/**
 * Gets all strong habits (forca > 50).
 */
export function getHabitosFortes(): Habito[] {
    return loadHabitos().filter(h => h.forca > 50);
}

/**
 * Gets habit descriptions for UI.
 */
export function getHabitosDescricao(): string[] {
    const fortes = getHabitosFortes();
    const descricoes: Record<TipoHabito, string> = {
        estudar: 'curioso',
        brincar: 'brincalhão',
        explorar: 'aventureiro',
        socializar: 'sociável',
        cozinhar: 'cozinheiro',
        rotina: 'organizado',
        cuidar: 'carinhoso',
    };

    return fortes.map(h => descricoes[h.tipo] || h.tipo);
}
