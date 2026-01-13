// ===== GROWTH SYSTEM TYPES =====
// Real-time progression based on actual elapsed time + care quality

// --- Pet State (Persisted) ---
export interface GrowthPet {
    id: string;
    faseAtual: 1 | 2 | 3 | 4 | 5;
    idadeEmMinutos: number;
    progressoDaFase: number; // 0.0 - 1.0
    energia: number; // 0-100
    estaDormindo: boolean;
    inicioSonoTimestamp: number | null;
    ultimoTimestampAtivo: number; // Unix timestamp in ms
}

// --- Care Metrics (Accumulated per phase) ---
export type ActivityType = 'brincar' | 'alimentar' | 'cozinhar' | 'limpar' | 'conversar';

export interface CareMetrics {
    tempoDormindoMin: number;
    tempoAcordadoMin: number;
    interacoesTotais: number;
    atividades: Record<ActivityType, number>;
}

// --- Phase Configuration ---
export interface PhaseConfig {
    tempoMinimoMinutos: number;
    sonoMinimo: number; // 0.0 - 1.0 (percentage of time that should be sleep)
    interacoesMinimas: number;
    nome: string;
}

// Phase requirements (realistic for testing: shorter times)
// Production values in comments
export const PHASE_CONFIGS: Record<number, PhaseConfig> = {
    1: {
        tempoMinimoMinutos: 60, // Production: 4320 (72h)
        sonoMinimo: 0.4,
        interacoesMinimas: 10,
        nome: 'Recém-nascido'
    },
    2: {
        tempoMinimoMinutos: 120, // Production: 7200 (5 days)
        sonoMinimo: 0.35,
        interacoesMinimas: 20,
        nome: 'Bebê'
    },
    3: {
        tempoMinimoMinutos: 240, // Production: 14400 (10 days)
        sonoMinimo: 0.3,
        interacoesMinimas: 35,
        nome: 'Filhote'
    },
    4: {
        tempoMinimoMinutos: 480, // Production: 21600 (15 days)
        sonoMinimo: 0.3,
        interacoesMinimas: 50,
        nome: 'Criança'
    },
    5: {
        tempoMinimoMinutos: Infinity, // Final phase - no more transitions
        sonoMinimo: 0.25,
        interacoesMinimas: 0,
        nome: 'Adolescente'
    },
};

// --- Activity Weights ---
export const ACTIVITY_WEIGHTS: Record<ActivityType, number> = {
    brincar: 1.0,
    cozinhar: 0.8,
    alimentar: 0.6,
    limpar: 0.5,
    conversar: 0.3,
};

// --- Factory Functions ---
export function createDefaultGrowthPet(): GrowthPet {
    return {
        id: `pet_${Date.now()}`,
        faseAtual: 1,
        idadeEmMinutos: 0,
        progressoDaFase: 0,
        energia: 100,
        estaDormindo: false,
        inicioSonoTimestamp: null,
        ultimoTimestampAtivo: Date.now(),
    };
}

export function createDefaultCareMetrics(): CareMetrics {
    return {
        tempoDormindoMin: 0,
        tempoAcordadoMin: 0,
        interacoesTotais: 0,
        atividades: {
            brincar: 0,
            alimentar: 0,
            cozinhar: 0,
            limpar: 0,
            conversar: 0,
        },
    };
}
