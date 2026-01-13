import {
    EstadoEmocional,
    Temperamento,
    Personalidade,
    TipoAcao,
    criarEstadoEmocionalInicial,
    clamp
} from '../../types/personality';
import { getEfeitoAcao } from './personalityService';

// ===== EMOTIONAL SERVICE =====
// Updates emotional state based on events and time

const STORAGE_KEY = 'lovepet_estado_emocional';

/**
 * Loads emotional state from storage.
 */
export function loadEstadoEmocional(): EstadoEmocional {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch {
        console.warn('Failed to load estado emocional');
    }
    const novo = criarEstadoEmocionalInicial();
    saveEstadoEmocional(novo);
    return novo;
}

/**
 * Saves emotional state to storage.
 */
export function saveEstadoEmocional(estado: EstadoEmocional): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(estado));
    } catch {
        console.warn('Failed to save estado emocional');
    }
}

/**
 * Updates emotional state based on action.
 */
export function atualizarEstadoPorAcao(
    acao: TipoAcao,
    estado: EstadoEmocional,
    temperamento: Temperamento
): EstadoEmocional {
    const efeito = getEfeitoAcao(acao);
    if (!efeito || !efeito.emocional) return estado;

    const novoEstado = { ...estado };

    // Intensity modifier from temperament
    const intensityMod = temperamento.intensidadeReacao > 60 ? 1.3 :
        temperamento.intensidadeReacao < 40 ? 0.7 : 1.0;

    for (const [emotion, delta] of Object.entries(efeito.emocional)) {
        if (delta === undefined) continue;
        const key = emotion as keyof EstadoEmocional;
        const finalDelta = Math.round(delta * intensityMod);
        novoEstado[key] = clamp(novoEstado[key] + finalDelta, 0, 100);
    }

    saveEstadoEmocional(novoEstado);
    return novoEstado;
}

/**
 * Natural decay of emotional states over time.
 * Called periodically (every few minutes).
 */
export function decayEstadoEmocional(
    estado: EstadoEmocional,
    minutosPasados: number
): EstadoEmocional {
    const decayRate = Math.floor(minutosPasados / 10); // Decay every 10 min
    if (decayRate <= 0) return estado;

    return {
        // Happiness decays slowly
        felicidade: clamp(estado.felicidade - decayRate, 30, 100),
        // Frustration decays naturally
        frustracao: clamp(estado.frustracao - decayRate * 2, 0, 100),
        // Anxiety decays slowly
        ansiedade: clamp(estado.ansiedade - decayRate, 0, 100),
        // Security stays relatively stable but can decay
        seguranca: clamp(estado.seguranca - Math.floor(decayRate / 2), 20, 100),
    };
}

/**
 * Gets mood description from emotional state.
 */
export function getHumorDescricao(estado: EstadoEmocional): string {
    if (estado.felicidade > 80 && estado.frustracao < 30) return 'radiante';
    if (estado.felicidade > 60) return 'feliz';
    if (estado.frustracao > 70) return 'frustrado';
    if (estado.ansiedade > 70) return 'ansioso';
    if (estado.seguranca < 30) return 'inseguro';
    if (estado.felicidade < 40) return 'triste';
    return 'neutro';
}

/**
 * Gets emoji representation of mood.
 */
export function getHumorEmoji(estado: EstadoEmocional): string {
    const humor = getHumorDescricao(estado);
    const emojis: Record<string, string> = {
        'radiante': '🤩',
        'feliz': '😊',
        'frustrado': '😤',
        'ansioso': '😰',
        'inseguro': '🥺',
        'triste': '😢',
        'neutro': '😐',
    };
    return emojis[humor] || '😊';
}
