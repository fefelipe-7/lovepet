import { GrowthPet, CareMetrics, PHASE_CONFIGS, createDefaultCareMetrics } from '../../types/growth';
import { resetMetrics } from './metricsService';

// ===== PROGRESSION SERVICE =====
// Evaluates phase progress and handles transitions

/**
 * Calculates the current phase progress (0.0 - 1.0).
 * Progress is the MINIMUM of: time progress, sleep progress, interaction progress.
 * This prevents rushing by just grinding one metric.
 */
export function calculatePhaseProgress(pet: GrowthPet, metrics: CareMetrics): number {
    const config = PHASE_CONFIGS[pet.faseAtual];

    if (!config || config.tempoMinimoMinutos === Infinity) {
        return 1.0; // Final phase, always complete
    }

    // 1. Time progress
    const progressoTempo = Math.min(1.0, pet.idadeEmMinutos / config.tempoMinimoMinutos);

    // 2. Sleep progress (percentage of time spent sleeping vs required)
    const totalTime = metrics.tempoDormindoMin + metrics.tempoAcordadoMin;
    const actualSleepRatio = totalTime > 0 ? metrics.tempoDormindoMin / totalTime : 0;
    const progressoSono = Math.min(1.0, actualSleepRatio / config.sonoMinimo);

    // 3. Interaction progress
    const progressoInteracao = config.interacoesMinimas > 0
        ? Math.min(1.0, metrics.interacoesTotais / config.interacoesMinimas)
        : 1.0;

    // Final progress is the minimum (all conditions must be met)
    return Math.min(progressoTempo, progressoSono, progressoInteracao);
}

/**
 * Gets detailed progress breakdown for UI.
 */
export function getProgressBreakdown(pet: GrowthPet, metrics: CareMetrics): {
    tempo: { current: number; required: number; progress: number };
    sono: { current: number; required: number; progress: number };
    interacoes: { current: number; required: number; progress: number };
    overall: number;
} {
    const config = PHASE_CONFIGS[pet.faseAtual];

    if (!config || config.tempoMinimoMinutos === Infinity) {
        return {
            tempo: { current: pet.idadeEmMinutos, required: 0, progress: 1.0 },
            sono: { current: 0, required: 0, progress: 1.0 },
            interacoes: { current: metrics.interacoesTotais, required: 0, progress: 1.0 },
            overall: 1.0,
        };
    }

    const totalTime = metrics.tempoDormindoMin + metrics.tempoAcordadoMin;
    const actualSleepRatio = totalTime > 0 ? metrics.tempoDormindoMin / totalTime : 0;
    const requiredSleepTime = Math.floor(config.tempoMinimoMinutos * config.sonoMinimo);

    const tempoProgress = Math.min(1.0, pet.idadeEmMinutos / config.tempoMinimoMinutos);
    const sonoProgress = Math.min(1.0, actualSleepRatio / config.sonoMinimo);
    const interacoesProgress = config.interacoesMinimas > 0
        ? Math.min(1.0, metrics.interacoesTotais / config.interacoesMinimas)
        : 1.0;

    return {
        tempo: {
            current: pet.idadeEmMinutos,
            required: config.tempoMinimoMinutos,
            progress: tempoProgress
        },
        sono: {
            current: metrics.tempoDormindoMin,
            required: requiredSleepTime,
            progress: sonoProgress
        },
        interacoes: {
            current: metrics.interacoesTotais,
            required: config.interacoesMinimas,
            progress: interacoesProgress
        },
        overall: Math.min(tempoProgress, sonoProgress, interacoesProgress),
    };
}

/**
 * Checks if pet is ready for phase transition and performs it.
 * Returns updated pet if transition happened, null otherwise.
 */
export function checkPhaseTransition(pet: GrowthPet, metrics: CareMetrics): {
    pet: GrowthPet;
    metrics: CareMetrics;
    transitioned: boolean;
} {
    const progress = calculatePhaseProgress(pet, metrics);

    // Check if ready to transition
    if (progress >= 1.0 && pet.faseAtual < 5) {
        const newPet: GrowthPet = {
            ...pet,
            faseAtual: (pet.faseAtual + 1) as 1 | 2 | 3 | 4 | 5,
            progressoDaFase: 0,
            idadeEmMinutos: 0, // Reset age for new phase
        };

        // Reset metrics for new phase
        const newMetrics = resetMetrics();

        return {
            pet: newPet,
            metrics: newMetrics,
            transitioned: true,
        };
    }

    // Update progress
    return {
        pet: { ...pet, progressoDaFase: progress },
        metrics,
        transitioned: false,
    };
}

/**
 * Gets phase name for display.
 */
export function getPhaseName(phase: number): string {
    return PHASE_CONFIGS[phase]?.nome || 'Desconhecido';
}
