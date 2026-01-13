import { Memoria, EmocaoMemoria, clamp } from '../../types/personality';

// ===== MEMORY SERVICE =====
// Stores emotionally significant events

const STORAGE_KEY = 'lovepet_memorias';
const MAX_MEMORIES = 50;

/**
 * Loads memories from storage.
 */
export function loadMemorias(): Memoria[] {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch {
        console.warn('Failed to load memorias');
    }
    return [];
}

/**
 * Saves memories to storage.
 */
function saveMemorias(memorias: Memoria[]): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(memorias));
    } catch {
        console.warn('Failed to save memorias');
    }
}

/**
 * Records a significant memory.
 */
export function registrarMemoria(
    evento: string,
    emocao: EmocaoMemoria,
    intensidade: number,
    idadeEmMinutos: number
): Memoria[] {
    const memorias = loadMemorias();

    const novaMemoria: Memoria = {
        id: `mem_${Date.now()}`,
        evento,
        emocaoAssociada: emocao,
        intensidade: clamp(intensidade, 0, 100),
        idadeEmMinutos,
        timestamp: Date.now(),
    };

    memorias.push(novaMemoria);

    // Keep only most recent significant memories
    const sorted = memorias.sort((a, b) => b.intensidade - a.intensidade);
    const limited = sorted.slice(0, MAX_MEMORIES);

    saveMemorias(limited);
    return limited;
}

/**
 * Checks if should create memory based on chance and emotion intensity.
 */
export function deveCriarMemoria(chance: number, intensidadeEmocional: number): boolean {
    // Higher emotional intensity increases chance
    const adjustedChance = chance * (1 + intensidadeEmocional / 100);
    return Math.random() < adjustedChance;
}

/**
 * Gets memory influence on a personality trait.
 * Positive memories boost confidence, negative ones may reduce it.
 */
export function getMemoriaInfluencia(trait: 'confianca' | 'empatia' | 'seguranca'): number {
    const memorias = loadMemorias();
    let influence = 0;

    for (const mem of memorias) {
        const timeWeight = 1 / (1 + mem.idadeEmMinutos / 10000); // Older memories weigh less
        const baseInfluence = mem.intensidade / 10 * timeWeight;

        if (mem.emocaoAssociada === 'alegria' || mem.emocaoAssociada === 'orgulho' || mem.emocaoAssociada === 'amor') {
            influence += baseInfluence;
        } else if (mem.emocaoAssociada === 'tristeza' || mem.emocaoAssociada === 'medo' || mem.emocaoAssociada === 'frustacao') {
            influence -= baseInfluence * 0.5; // Negative memories have less weight
        }
    }

    return clamp(influence, -20, 20);
}

/**
 * Gets recent significant memories for display.
 */
export function getMemoriasRecentes(limit: number = 5): Memoria[] {
    return loadMemorias()
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, limit);
}

/**
 * Gets memory descriptions for UI.
 */
export function getMemoriaDescricao(memoria: Memoria): string {
    const emocaoEmojis: Record<EmocaoMemoria, string> = {
        alegria: '😊',
        tristeza: '😢',
        medo: '😰',
        orgulho: '🥹',
        frustacao: '😤',
        amor: '💕',
    };

    return `${emocaoEmojis[memoria.emocaoAssociada]} ${memoria.evento}`;
}
