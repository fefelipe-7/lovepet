// ===== PERSONALITY SYSTEM TYPES =====
// Deep psychological model for creating emotional bond

// --- Temperamento (base fixa, quase não muda) ---
export interface Temperamento {
    sensibilidadeEmocional: number; // 0-100 - se afeta mais com eventos
    nivelDeEnergia: number;         // 0-100 - ativo vs calmo
    adaptabilidade: number;         // 0-100 - aceita mudanças
    intensidadeReacao: number;      // 0-100 - reage forte vs sutil
}

// --- Personalidade (moldável pelo jogador) ---
export interface Personalidade {
    curiosidadeCognitiva: number;  // aprender, perguntar
    persistencia: number;          // insiste vs desiste fácil
    autonomia: number;             // faz sozinho vs depende
    sociabilidade: number;         // busca interação
    empatia: number;               // percebe emoções alheias
    autorregulacao: number;        // controla impulsos
    imaginacao: number;            // fantasia, cria histórias
    confianca: number;             // segurança emocional
    disciplina: number;            // rotina, regras
}

// --- Estado Emocional (muda constantemente) ---
export interface EstadoEmocional {
    felicidade: number;  // 0-100
    frustracao: number;  // 0-100
    ansiedade: number;   // 0-100
    seguranca: number;   // 0-100
}

// --- Hábitos (formados por repetição) ---
export type TipoHabito = 'estudar' | 'brincar' | 'explorar' | 'socializar' | 'cozinhar' | 'rotina' | 'cuidar';

export interface Habito {
    tipo: TipoHabito;
    forca: number; // 0-100
    ultimaVez: number; // timestamp
}

// --- Memória Emocional ---
export type EmocaoMemoria = 'alegria' | 'tristeza' | 'medo' | 'orgulho' | 'frustacao' | 'amor';

export interface Memoria {
    id: string;
    evento: string;
    emocaoAssociada: EmocaoMemoria;
    intensidade: number; // 0-100
    idadeEmMinutos: number;
    timestamp: number;
}

// --- Estado Completo da Personalidade ---
export interface PersonalidadeCompleta {
    temperamento: Temperamento;
    personalidade: Personalidade;
    estadoEmocional: EstadoEmocional;
    habitos: Habito[];
    memorias: Memoria[];
}

// --- Ações que afetam personalidade ---
export type TipoAcao =
    | 'brincar_livre'
    | 'brincar_regras'
    | 'cozinhar'
    | 'alimentar'
    | 'limpar'
    | 'dormir'
    | 'acordar'
    | 'elogiar'
    | 'ignorar'
    | 'consolar'
    | 'ensinar';

// --- Efeitos de ação ---
export interface EfeitoAcao {
    personalidade: Partial<Record<keyof Personalidade, number>>;
    emocional: Partial<Record<keyof EstadoEmocional, number>>;
    habito?: TipoHabito;
    memoriaChance?: number; // 0-1 chance de criar memória
}

// --- Perfis Emergentes ---
export type PerfilEmergente =
    | 'curioso_nerd'
    | 'brincalhao_criativo'
    | 'carinhoso_empatico'
    | 'independente_aventureiro'
    | 'disciplinado_focado'
    | 'sensivel_artistico'
    | 'energetico_expansivo'
    | 'calmo_observador';

// --- Factory Functions ---
export function gerarTemperamento(): Temperamento {
    return {
        sensibilidadeEmocional: randomRange(30, 80),
        nivelDeEnergia: randomRange(30, 80),
        adaptabilidade: randomRange(30, 80),
        intensidadeReacao: randomRange(30, 80),
    };
}

export function criarPersonalidadeInicial(): Personalidade {
    return {
        curiosidadeCognitiva: 50,
        persistencia: 50,
        autonomia: 50,
        sociabilidade: 50,
        empatia: 50,
        autorregulacao: 50,
        imaginacao: 50,
        confianca: 50,
        disciplina: 50,
    };
}

export function criarEstadoEmocionalInicial(): EstadoEmocional {
    return {
        felicidade: 70,
        frustracao: 20,
        ansiedade: 20,
        seguranca: 70,
    };
}

export function criarPersonalidadeCompleta(): PersonalidadeCompleta {
    return {
        temperamento: gerarTemperamento(),
        personalidade: criarPersonalidadeInicial(),
        estadoEmocional: criarEstadoEmocionalInicial(),
        habitos: [],
        memorias: [],
    };
}

// --- Helpers ---
function randomRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}
