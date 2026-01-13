import { GrowthPet, CareMetrics } from '../../types/growth';

// ===== TIME SERVICE =====
// Handles real-time calculations for pet age and sleep cycles

/**
 * Calculates time delta since last active timestamp.
 * @returns Delta in minutes
 */
export function calculateTimeDelta(pet: GrowthPet): number {
    const now = Date.now();
    const deltaMs = now - pet.ultimoTimestampAtivo;
    return Math.floor(deltaMs / 60000); // Convert to minutes
}

/**
 * Updates pet age based on real elapsed time.
 * Called when app opens or pet is accessed.
 */
export function updatePetAge(pet: GrowthPet): GrowthPet {
    const deltaMinutes = calculateTimeDelta(pet);

    if (deltaMinutes <= 0) return pet;

    return {
        ...pet,
        idadeEmMinutos: pet.idadeEmMinutos + deltaMinutes,
        ultimoTimestampAtivo: Date.now(),
    };
}

/**
 * Processes sleep cycles based on elapsed time.
 * If pet was sleeping, accumulates sleep time in metrics.
 * Also handles energy changes.
 */
export function processSleepCycles(
    pet: GrowthPet,
    metrics: CareMetrics
): { pet: GrowthPet; metrics: CareMetrics } {
    const deltaMinutes = calculateTimeDelta(pet);

    if (deltaMinutes <= 0) {
        return { pet, metrics };
    }

    let newPet = { ...pet };
    let newMetrics = { ...metrics };

    if (pet.estaDormindo && pet.inicioSonoTimestamp) {
        // Calculate sleep time
        const sleepDeltaMs = Date.now() - pet.inicioSonoTimestamp;
        const sleepMinutes = Math.floor(sleepDeltaMs / 60000);

        // Accumulate sleep time
        newMetrics = {
            ...newMetrics,
            tempoDormindoMin: newMetrics.tempoDormindoMin + sleepMinutes,
        };

        // Restore energy while sleeping (1% per 5 minutes, max 100)
        const energyGain = Math.floor(sleepMinutes / 5);
        newPet = {
            ...newPet,
            energia: Math.min(100, newPet.energia + energyGain),
            inicioSonoTimestamp: Date.now(), // Reset for next cycle
        };
    } else {
        // Accumulate awake time
        newMetrics = {
            ...newMetrics,
            tempoAcordadoMin: newMetrics.tempoAcordadoMin + deltaMinutes,
        };

        // Drain energy while awake (1% per 10 minutes, min 0)
        const energyDrain = Math.floor(deltaMinutes / 10);
        newPet = {
            ...newPet,
            energia: Math.max(0, newPet.energia - energyDrain),
        };
    }

    // Update timestamp
    newPet = {
        ...newPet,
        ultimoTimestampAtivo: Date.now(),
    };

    return { pet: newPet, metrics: newMetrics };
}

/**
 * Puts pet to sleep.
 */
export function startSleep(pet: GrowthPet): GrowthPet {
    return {
        ...pet,
        estaDormindo: true,
        inicioSonoTimestamp: Date.now(),
    };
}

/**
 * Wakes pet up.
 */
export function endSleep(pet: GrowthPet, metrics: CareMetrics): { pet: GrowthPet; metrics: CareMetrics } {
    if (!pet.estaDormindo || !pet.inicioSonoTimestamp) {
        return { pet: { ...pet, estaDormindo: false }, metrics };
    }

    // Calculate final sleep duration
    const sleepDeltaMs = Date.now() - pet.inicioSonoTimestamp;
    const sleepMinutes = Math.floor(sleepDeltaMs / 60000);

    return {
        pet: {
            ...pet,
            estaDormindo: false,
            inicioSonoTimestamp: null,
        },
        metrics: {
            ...metrics,
            tempoDormindoMin: metrics.tempoDormindoMin + sleepMinutes,
        },
    };
}
