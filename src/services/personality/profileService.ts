import { Personalidade, PerfilEmergente } from '../../types/personality';

// ===== PROFILE SERVICE =====
// Interprets personality traits to generate emergent profiles

interface PerfilCriteria {
    perfil: PerfilEmergente;
    nome: string;
    emoji: string;
    criterios: {
        trait: keyof Personalidade;
        minimo?: number;
        maximo?: number;
    }[];
}

const PERFIS: PerfilCriteria[] = [
    {
        perfil: 'curioso_nerd',
        nome: 'Curioso',
        emoji: '🤓',
        criterios: [
            { trait: 'curiosidadeCognitiva', minimo: 70 },
            { trait: 'persistencia', minimo: 60 },
            { trait: 'imaginacao', minimo: 50 },
        ],
    },
    {
        perfil: 'brincalhao_criativo',
        nome: 'Brincalhão',
        emoji: '🎨',
        criterios: [
            { trait: 'imaginacao', minimo: 70 },
            { trait: 'sociabilidade', minimo: 60 },
            { trait: 'autorregulacao', maximo: 55 },
        ],
    },
    {
        perfil: 'carinhoso_empatico',
        nome: 'Carinhoso',
        emoji: '💕',
        criterios: [
            { trait: 'empatia', minimo: 70 },
            { trait: 'sociabilidade', minimo: 60 },
            { trait: 'confianca', minimo: 55 },
        ],
    },
    {
        perfil: 'independente_aventureiro',
        nome: 'Aventureiro',
        emoji: '🌟',
        criterios: [
            { trait: 'autonomia', minimo: 70 },
            { trait: 'confianca', minimo: 65 },
            { trait: 'curiosidadeCognitiva', minimo: 55 },
        ],
    },
    {
        perfil: 'disciplinado_focado',
        nome: 'Disciplinado',
        emoji: '📚',
        criterios: [
            { trait: 'disciplina', minimo: 70 },
            { trait: 'autorregulacao', minimo: 65 },
            { trait: 'persistencia', minimo: 60 },
        ],
    },
    {
        perfil: 'sensivel_artistico',
        nome: 'Sensível',
        emoji: '🎭',
        criterios: [
            { trait: 'empatia', minimo: 65 },
            { trait: 'imaginacao', minimo: 65 },
            { trait: 'autorregulacao', maximo: 50 },
        ],
    },
    {
        perfil: 'energetico_expansivo',
        nome: 'Energético',
        emoji: '⚡',
        criterios: [
            { trait: 'sociabilidade', minimo: 75 },
            { trait: 'autonomia', minimo: 60 },
        ],
    },
    {
        perfil: 'calmo_observador',
        nome: 'Observador',
        emoji: '🔍',
        criterios: [
            { trait: 'autorregulacao', minimo: 70 },
            { trait: 'curiosidadeCognitiva', minimo: 60 },
            { trait: 'sociabilidade', maximo: 50 },
        ],
    },
];

/**
 * Gets all emergent profiles that match current personality.
 * A pet can have multiple profiles simultaneously.
 */
export function getPerfisEmergentes(personalidade: Personalidade): { perfil: PerfilEmergente; nome: string; emoji: string }[] {
    const matching: { perfil: PerfilEmergente; nome: string; emoji: string }[] = [];

    for (const p of PERFIS) {
        let matches = true;

        for (const criterio of p.criterios) {
            const value = personalidade[criterio.trait];

            if (criterio.minimo !== undefined && value < criterio.minimo) {
                matches = false;
                break;
            }
            if (criterio.maximo !== undefined && value > criterio.maximo) {
                matches = false;
                break;
            }
        }

        if (matches) {
            matching.push({ perfil: p.perfil, nome: p.nome, emoji: p.emoji });
        }
    }

    return matching;
}

/**
 * Gets primary profile (strongest match).
 */
export function getPerfilPrimario(personalidade: Personalidade): { nome: string; emoji: string } | null {
    const perfis = getPerfisEmergentes(personalidade);
    return perfis.length > 0 ? perfis[0] : null;
}

/**
 * Gets personality description for UI.
 */
export function getPersonalidadeDescricao(personalidade: Personalidade): string[] {
    const desc: string[] = [];

    if (personalidade.curiosidadeCognitiva > 70) desc.push('muito curioso');
    if (personalidade.persistencia > 70) desc.push('persistente');
    if (personalidade.autonomia > 70) desc.push('independente');
    if (personalidade.sociabilidade > 70) desc.push('sociável');
    if (personalidade.empatia > 70) desc.push('empático');
    if (personalidade.autorregulacao > 70) desc.push('controlado');
    if (personalidade.imaginacao > 70) desc.push('imaginativo');
    if (personalidade.confianca > 70) desc.push('confiante');
    if (personalidade.disciplina > 70) desc.push('disciplinado');

    // Low traits
    if (personalidade.confianca < 30) desc.push('inseguro');
    if (personalidade.sociabilidade < 30) desc.push('tímido');
    if (personalidade.autorregulacao < 30) desc.push('impulsivo');

    return desc.length > 0 ? desc : ['em desenvolvimento'];
}
