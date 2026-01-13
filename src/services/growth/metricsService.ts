import { CareMetrics, ActivityType, ACTIVITY_WEIGHTS, createDefaultCareMetrics } from '../../types/growth';

// ===== METRICS SERVICE =====
// Tracks care metrics (interactions, activities) per phase

const STORAGE_KEY = 'lovepet_care_metrics';

/**
 * Gets current care metrics from storage.
 */
export function getMetrics(): CareMetrics {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch {
        console.warn('Failed to load care metrics');
    }
    return createDefaultCareMetrics();
}

/**
 * Saves care metrics to storage.
 */
function saveMetrics(metrics: CareMetrics): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(metrics));
    } catch {
        console.warn('Failed to save care metrics');
    }
}

/**
 * Records an interaction/activity.
 * Increments total interactions and specific activity counter.
 */
export function recordInteraction(type: ActivityType): CareMetrics {
    const metrics = getMetrics();

    const updatedMetrics: CareMetrics = {
        ...metrics,
        interacoesTotais: metrics.interacoesTotais + 1,
        atividades: {
            ...metrics.atividades,
            [type]: metrics.atividades[type] + 1,
        },
    };

    saveMetrics(updatedMetrics);
    return updatedMetrics;
}

/**
 * Updates time metrics (called from timeService).
 */
export function updateTimeMetrics(metrics: CareMetrics): void {
    saveMetrics(metrics);
}

/**
 * Resets metrics for new phase.
 */
export function resetMetrics(): CareMetrics {
    const emptyMetrics = createDefaultCareMetrics();
    saveMetrics(emptyMetrics);
    return emptyMetrics;
}

/**
 * Calculates weighted interaction score.
 */
export function calculateWeightedInteractions(metrics: CareMetrics): number {
    let weighted = 0;

    for (const [activity, count] of Object.entries(metrics.atividades)) {
        const weight = ACTIVITY_WEIGHTS[activity as ActivityType] || 0.5;
        weighted += count * weight;
    }

    return weighted;
}
