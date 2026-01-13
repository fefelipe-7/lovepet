// ===== PERSONALITY SYSTEM INDEX =====
// Re-exports all personality services

// Types
export * from '../../types/personality';

// Services
export { loadTemperamento, saveTemperamento, getTemperamentoDescricao } from './temperamentService';
export { loadPersonalidade, savePersonalidade, aplicarEfeitoAcao, mapGameActionToPersonality } from './personalityService';
export { loadEstadoEmocional, saveEstadoEmocional, atualizarEstadoPorAcao, getHumorDescricao, getHumorEmoji, decayEstadoEmocional } from './emotionalService';
export { loadHabitos, registrarAcaoHabito, getHabitoMultiplier, getHabitosDescricao, decairHabitos } from './habitService';
export { loadMemorias, registrarMemoria, deveCriarMemoria, getMemoriasRecentes, getMemoriaDescricao } from './memoryService';
export { getPerfisEmergentes, getPerfilPrimario, getPersonalidadeDescricao } from './profileService';
