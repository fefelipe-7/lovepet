import {
    Personalidade,
    Temperamento,
    EstadoEmocional,
    TipoAcao,
    EfeitoAcao,
    criarPersonalidadeInicial,
    clamp
} from '../../types/personality';
import { getTemperamentoModifier } from './temperamentService';

// ===== PERSONALITY SERVICE =====
// Modifies personality based on actions

const STORAGE_KEY = 'lovepet_personalidade';

// --- Action Effects Definition ---
const EFEITOS_ACOES: Record<TipoAcao, EfeitoAcao> = {
    brincar_livre: {
        personalidade: { imaginacao: 3, sociabilidade: 2, disciplina: -1, autorregulacao: -1 },
        emocional: { felicidade: 10, frustracao: -5 },
        habito: 'brincar',
        memoriaChance: 0.1,
    },
    brincar_regras: {
        personalidade: { disciplina: 2, autorregulacao: 2, persistencia: 1 },
        emocional: { felicidade: 5, frustracao: 2 },
        habito: 'brincar',
        memoriaChance: 0.05,
    },
    cozinhar: {
        personalidade: { curiosidadeCognitiva: 2, persistencia: 2, autonomia: 1 },
        emocional: { felicidade: 8, seguranca: 5 },
        habito: 'cozinhar',
        memoriaChance: 0.2,
    },
    alimentar: {
        personalidade: { confianca: 1, empatia: 1 },
        emocional: { felicidade: 5, seguranca: 3 },
        habito: 'cuidar',
        memoriaChance: 0.05,
    },
    limpar: {
        personalidade: { disciplina: 2, autorregulacao: 1 },
        emocional: { frustracao: 2, seguranca: 2 },
        habito: 'rotina',
        memoriaChance: 0.02,
    },
    dormir: {
        personalidade: { autorregulacao: 1 },
        emocional: { ansiedade: -10, frustracao: -5 },
        habito: 'rotina',
    },
    acordar: {
        personalidade: {},
        emocional: { felicidade: 5 },
    },
    elogiar: {
        personalidade: { confianca: 3, persistencia: 2 },
        emocional: { felicidade: 15, seguranca: 10 },
        memoriaChance: 0.3,
    },
    ignorar: {
        personalidade: { confianca: -2, sociabilidade: -1, autonomia: 1 },
        emocional: { felicidade: -10, seguranca: -8, ansiedade: 5 },
        memoriaChance: 0.4,
    },
    consolar: {
        personalidade: { confianca: 2, empatia: 2, seguranca: 2 },
        emocional: { frustracao: -10, ansiedade: -10, seguranca: 15 },
        memoriaChance: 0.25,
    },
    ensinar: {
        personalidade: { curiosidadeCognitiva: 3, disciplina: 2, persistencia: 1 },
        emocional: { frustracao: 3 },
        habito: 'estudar',
        memoriaChance: 0.15,
    },
};

/**
 * Loads personality from storage.
 */
export function loadPersonalidade(): Personalidade {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch {
        console.warn('Failed to load personalidade');
    }
    const nova = criarPersonalidadeInicial();
    savePersonalidade(nova);
    return nova;
}

/**
 * Saves personality to storage.
 */
export function savePersonalidade(pers: Personalidade): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(pers));
    } catch {
        console.warn('Failed to save personalidade');
    }
}

/**
 * Applies action effect to personality.
 * Takes into account temperament and current emotional state.
 */
export function aplicarEfeitoAcao(
    acao: TipoAcao,
    personalidade: Personalidade,
    temperamento: Temperamento,
    estado: EstadoEmocional
): { personalidade: Personalidade; efeitoBase: EfeitoAcao } {
    const efeito = EFEITOS_ACOES[acao];
    if (!efeito) return { personalidade, efeitoBase: efeito };

    const tempModifier = getTemperamentoModifier(temperamento, 1);

    // State modifiers
    let stateModifier = 1.0;
    if (estado.frustracao > 60) stateModifier *= 0.7; // Less receptive when frustrated
    if (estado.felicidade > 70) stateModifier *= 1.2; // More receptive when happy
    if (estado.ansiedade > 60) stateModifier *= 0.8; // Less receptive when anxious

    const novaPersonalidade = { ...personalidade };

    for (const [trait, delta] of Object.entries(efeito.personalidade)) {
        if (delta === undefined) continue;
        const key = trait as keyof Personalidade;
        const finalDelta = Math.round(delta * tempModifier * stateModifier);
        novaPersonalidade[key] = clamp(novaPersonalidade[key] + finalDelta, 0, 100);
    }

    savePersonalidade(novaPersonalidade);
    return { personalidade: novaPersonalidade, efeitoBase: efeito };
}

/**
 * Gets action effect definition.
 */
export function getEfeitoAcao(acao: TipoAcao): EfeitoAcao | undefined {
    return EFEITOS_ACOES[acao];
}

/**
 * Maps game action types to personality action types.
 */
export function mapGameActionToPersonality(gameAction: string): TipoAcao | null {
    const mapping: Record<string, TipoAcao> = {
        'brincar': 'brincar_livre',
        'alimentar': 'alimentar',
        'cozinhar': 'cozinhar',
        'limpar': 'limpar',
        'dormir': 'dormir',
        'acordar': 'acordar',
        'conversar': 'elogiar', // Default to positive
    };
    return mapping[gameAction] || null;
}
