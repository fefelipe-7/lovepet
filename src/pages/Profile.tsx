import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GrowthPet, CareMetrics, PHASE_CONFIGS } from '../types/growth';
import {
    Temperamento,
    Personalidade,
    EstadoEmocional,
    Habito,
    Memoria
} from '../types/personality';
import { getTemperamentoDescricao } from '../services/personality/temperamentService';
import { getHumorDescricao, getHumorEmoji } from '../services/personality/emotionalService';
import { getHabitosDescricao } from '../services/personality/habitService';
import { getPerfisEmergentes, getPersonalidadeDescricao } from '../services/personality/profileService';
import { getProgressBreakdown } from '../services/growth/progressionService';

interface ProfilePageProps {
    growthPet: GrowthPet;
    careMetrics: CareMetrics;
    temperamento: Temperamento;
    personalidade: Personalidade;
    estadoEmocional: EstadoEmocional;
    habitos: Habito[];
    memorias: Memoria[];
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
    growthPet,
    careMetrics,
    temperamento,
    personalidade,
    estadoEmocional,
    habitos,
    memorias
}) => {
    const navigate = useNavigate();
    const progress = getProgressBreakdown(growthPet, careMetrics);
    const perfis = getPerfisEmergentes(personalidade);
    const temperamentoDesc = getTemperamentoDescricao(temperamento);
    const personalidadeDesc = getPersonalidadeDescricao(personalidade);
    const habitosDesc = getHabitosDescricao();
    const humor = getHumorDescricao(estadoEmocional);
    const humorEmoji = getHumorEmoji(estadoEmocional);

    const formatMinutes = (min: number) => {
        if (min < 60) return `${min}min`;
        const hours = Math.floor(min / 60);
        if (hours < 24) return `${hours}h`;
        const days = Math.floor(hours / 24);
        return `${days}d`;
    };

    const phaseName = PHASE_CONFIGS[growthPet.faseAtual]?.nome || 'Desconhecido';

    return (
        <div className="min-h-[100dvh] w-full bg-gradient-to-b from-pink-50 to-white flex flex-col">

            {/* Header */}
            <header className="p-4 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-sm border-b border-pink-100">
                <button
                    onClick={() => navigate('/')}
                    className="bg-white rounded-full p-2.5 shadow-sm text-xl hover:scale-105 transition-transform"
                >
                    ⬅️
                </button>
                <h1 className="text-xl font-black text-cute-text lowercase">perfil do bichinho</h1>
                <div className="w-10"></div>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">

                {/* Pet Info Card */}
                <section className="bg-white rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-pink-200 to-rose-100 rounded-2xl flex items-center justify-center text-4xl">
                            🥚
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-black text-cute-text lowercase">bichinho</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full text-xs font-bold">
                                    {phaseName}
                                </span>
                                <span className="text-2xl">{humorEmoji}</span>
                                <span className="text-xs text-cute-text/60 lowercase">{humor}</span>
                            </div>
                            {perfis.length > 0 && (
                                <div className="flex gap-1 mt-2 flex-wrap">
                                    {perfis.map(p => (
                                        <span key={p.perfil} className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs font-bold">
                                            {p.emoji} {p.nome}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Growth Progress */}
                <section className="bg-white rounded-2xl p-4 shadow-sm">
                    <h3 className="text-sm font-bold text-cute-text/70 mb-3 lowercase flex items-center gap-2">
                        📈 progresso de crescimento
                    </h3>

                    <div className="space-y-3">
                        {/* Time */}
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-cute-text/60">⏱️ tempo</span>
                                <span className="font-bold">{formatMinutes(progress.tempo.current)} / {formatMinutes(progress.tempo.required)}</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full transition-all"
                                    style={{ width: `${progress.tempo.progress * 100}%` }}
                                />
                            </div>
                        </div>

                        {/* Sleep */}
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-cute-text/60">😴 sono</span>
                                <span className="font-bold">{Math.round(progress.sono.progress * 100)}%</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-purple-400 to-violet-400 rounded-full transition-all"
                                    style={{ width: `${progress.sono.progress * 100}%` }}
                                />
                            </div>
                        </div>

                        {/* Interactions */}
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-cute-text/60">💕 interações</span>
                                <span className="font-bold">{progress.interacoes.current} / {progress.interacoes.required}</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-pink-400 to-rose-400 rounded-full transition-all"
                                    style={{ width: `${progress.interacoes.progress * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 p-3 bg-pink-50 rounded-xl">
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-cute-text/60 lowercase">progresso total</span>
                            <span className="text-lg font-black text-pink-600">{Math.round(progress.overall * 100)}%</span>
                        </div>
                    </div>
                </section>

                {/* Temperament */}
                <section className="bg-white rounded-2xl p-4 shadow-sm">
                    <h3 className="text-sm font-bold text-cute-text/70 mb-3 lowercase flex items-center gap-2">
                        🧬 temperamento
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                        <TraitBar label="sensibilidade" value={temperamento.sensibilidadeEmocional} color="from-red-300 to-red-400" />
                        <TraitBar label="energia" value={temperamento.nivelDeEnergia} color="from-yellow-300 to-orange-400" />
                        <TraitBar label="adaptabilidade" value={temperamento.adaptabilidade} color="from-green-300 to-emerald-400" />
                        <TraitBar label="intensidade" value={temperamento.intensidadeReacao} color="from-purple-300 to-violet-400" />
                    </div>
                    {temperamentoDesc.length > 0 && (
                        <div className="flex gap-1 mt-3 flex-wrap">
                            {temperamentoDesc.map(d => (
                                <span key={d} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">{d}</span>
                            ))}
                        </div>
                    )}
                </section>

                {/* Personality */}
                <section className="bg-white rounded-2xl p-4 shadow-sm">
                    <h3 className="text-sm font-bold text-cute-text/70 mb-3 lowercase flex items-center gap-2">
                        🎭 personalidade
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                        <TraitCircle label="curiosidade" value={personalidade.curiosidadeCognitiva} emoji="🔍" />
                        <TraitCircle label="persistência" value={personalidade.persistencia} emoji="💪" />
                        <TraitCircle label="autonomia" value={personalidade.autonomia} emoji="🦸" />
                        <TraitCircle label="sociabilidade" value={personalidade.sociabilidade} emoji="🤝" />
                        <TraitCircle label="empatia" value={personalidade.empatia} emoji="💕" />
                        <TraitCircle label="autocontrole" value={personalidade.autorregulacao} emoji="🧘" />
                        <TraitCircle label="imaginação" value={personalidade.imaginacao} emoji="🌈" />
                        <TraitCircle label="confiança" value={personalidade.confianca} emoji="⭐" />
                        <TraitCircle label="disciplina" value={personalidade.disciplina} emoji="📚" />
                    </div>
                </section>

                {/* Emotional State */}
                <section className="bg-white rounded-2xl p-4 shadow-sm">
                    <h3 className="text-sm font-bold text-cute-text/70 mb-3 lowercase flex items-center gap-2">
                        💭 estado emocional agora
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                        <EmotionBar label="felicidade" value={estadoEmocional.felicidade} emoji="😊" color="bg-yellow-400" />
                        <EmotionBar label="segurança" value={estadoEmocional.seguranca} emoji="🛡️" color="bg-blue-400" />
                        <EmotionBar label="frustração" value={estadoEmocional.frustracao} emoji="😤" color="bg-red-400" negative />
                        <EmotionBar label="ansiedade" value={estadoEmocional.ansiedade} emoji="😰" color="bg-purple-400" negative />
                    </div>
                </section>

                {/* Habits */}
                {habitos.length > 0 && (
                    <section className="bg-white rounded-2xl p-4 shadow-sm">
                        <h3 className="text-sm font-bold text-cute-text/70 mb-3 lowercase flex items-center gap-2">
                            🔄 hábitos formados
                        </h3>
                        <div className="space-y-2">
                            {habitos.map(h => (
                                <div key={h.tipo} className="flex items-center gap-2">
                                    <div className="flex-1">
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="font-medium lowercase">{h.tipo}</span>
                                            <span className="text-cute-text/60">{h.forca}%</span>
                                        </div>
                                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-emerald-400 rounded-full"
                                                style={{ width: `${h.forca}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Memories */}
                {memorias.length > 0 && (
                    <section className="bg-white rounded-2xl p-4 shadow-sm">
                        <h3 className="text-sm font-bold text-cute-text/70 mb-3 lowercase flex items-center gap-2">
                            📸 memórias
                        </h3>
                        <div className="space-y-2">
                            {memorias.slice(0, 5).map(m => (
                                <div key={m.id} className="flex items-start gap-2 p-2 bg-gray-50 rounded-xl">
                                    <span className="text-xl">
                                        {m.emocaoAssociada === 'alegria' ? '😊' :
                                            m.emocaoAssociada === 'tristeza' ? '😢' :
                                                m.emocaoAssociada === 'medo' ? '😰' :
                                                    m.emocaoAssociada === 'orgulho' ? '🥹' :
                                                        m.emocaoAssociada === 'frustacao' ? '😤' : '💕'}
                                    </span>
                                    <div className="flex-1">
                                        <p className="text-xs text-cute-text lowercase">{m.evento}</p>
                                        <p className="text-[10px] text-cute-text/40">{formatMinutes(m.idadeEmMinutos)} de vida</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Stats Summary */}
                <section className="bg-gradient-to-r from-pink-100 to-rose-100 rounded-2xl p-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-2xl font-black text-pink-600">{formatMinutes(growthPet.idadeEmMinutos)}</p>
                            <p className="text-[10px] text-pink-600/60 lowercase">idade</p>
                        </div>
                        <div>
                            <p className="text-2xl font-black text-pink-600">{careMetrics.interacoesTotais}</p>
                            <p className="text-[10px] text-pink-600/60 lowercase">interações</p>
                        </div>
                        <div>
                            <p className="text-2xl font-black text-pink-600">{memorias.length}</p>
                            <p className="text-[10px] text-pink-600/60 lowercase">memórias</p>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
};

// Helper Components
const TraitBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
    <div className="p-2 bg-gray-50 rounded-xl">
        <div className="flex justify-between text-xs mb-1">
            <span className="text-cute-text/60 lowercase">{label}</span>
            <span className="font-bold">{value}</span>
        </div>
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
                className={`h-full bg-gradient-to-r ${color} rounded-full`}
                style={{ width: `${value}%` }}
            />
        </div>
    </div>
);

const TraitCircle = ({ label, value, emoji }: { label: string; value: number; emoji: string }) => (
    <div className="flex flex-col items-center p-2">
        <div className="relative w-12 h-12">
            <svg className="w-full h-full -rotate-90">
                <circle cx="24" cy="24" r="20" fill="none" stroke="#f3f4f6" strokeWidth="4" />
                <circle
                    cx="24" cy="24" r="20"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="4"
                    strokeDasharray={`${value * 1.26} 126`}
                    strokeLinecap="round"
                />
                <defs>
                    <linearGradient id="gradient">
                        <stop offset="0%" stopColor="#f472b6" />
                        <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                </defs>
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-lg">{emoji}</span>
        </div>
        <span className="text-[10px] text-cute-text/60 mt-1 lowercase text-center">{label}</span>
    </div>
);

const EmotionBar = ({ label, value, emoji, color, negative = false }: {
    label: string; value: number; emoji: string; color: string; negative?: boolean
}) => (
    <div className={`p-2 rounded-xl ${negative ? 'bg-red-50' : 'bg-green-50'}`}>
        <div className="flex items-center gap-1 mb-1">
            <span className="text-sm">{emoji}</span>
            <span className="text-xs text-cute-text/60 lowercase flex-1">{label}</span>
            <span className="text-xs font-bold">{value}</span>
        </div>
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
                className={`h-full ${color} rounded-full`}
                style={{ width: `${value}%` }}
            />
        </div>
    </div>
);
