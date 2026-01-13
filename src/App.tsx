import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { User, PetState, ChatMessage, UserRole, Mood, GameItem, ItemEffects } from './types';
import { StatCalculator } from './services/gameLogic/StatCalculator';
import { getPetResponse } from './services/petResponseService';
import { SoundService } from './services/soundService';
import { Home } from './pages/Home';
import { KitchenPage } from './pages/Kitchen';
import { ProfilePage } from './pages/Profile';
import { consumeFromInventory } from './services/cooking/inventoryService';

// Growth System
import { GrowthPet, CareMetrics, createDefaultGrowthPet, createDefaultCareMetrics, ActivityType } from './types/growth';
import { processSleepCycles, startSleep, endSleep } from './services/growth/timeService';
import { getMetrics, recordInteraction, updateTimeMetrics } from './services/growth/metricsService';
import { checkPhaseTransition, getPhaseName } from './services/growth/progressionService';
import { loadPet, savePet } from './services/growth/petPersistence';

// Personality System
import {
    Temperamento, Personalidade, EstadoEmocional, Habito, Memoria, TipoAcao,
    criarPersonalidadeCompleta
} from './types/personality';
import { loadTemperamento, saveTemperamento, getTemperamentoDescricao } from './services/personality/temperamentService';
import { loadPersonalidade, savePersonalidade, aplicarEfeitoAcao, getEfeitoAcao, mapGameActionToPersonality } from './services/personality/personalityService';
import { loadEstadoEmocional, saveEstadoEmocional, atualizarEstadoPorAcao, getHumorEmoji } from './services/personality/emotionalService';
import { loadHabitos, registrarAcaoHabito } from './services/personality/habitService';
import { loadMemorias, registrarMemoria, deveCriarMemoria } from './services/personality/memoryService';
import { getPerfisEmergentes } from './services/personality/profileService';

const AppContent: React.FC = () => {
    // --- HARDCODED USERS ---
    const defaultUsers: Record<UserRole, User> = {
        [UserRole.USER_A]: { name: 'fefe', avatar: '👨' },
        [UserRole.USER_B]: { name: 'nana', avatar: '👩' }
    };

    // --- Growth System State ---
    const [growthPet, setGrowthPet] = useState<GrowthPet>(() => loadPet());
    const [careMetrics, setCareMetrics] = useState<CareMetrics>(() => getMetrics());

    // --- Personality System State ---
    const [temperamento] = useState<Temperamento>(() => loadTemperamento());
    const [personalidade, setPersonalidade] = useState<Personalidade>(() => loadPersonalidade());
    const [estadoEmocional, setEstadoEmocional] = useState<EstadoEmocional>(() => loadEstadoEmocional());
    const [habitos, setHabitos] = useState<Habito[]>(() => loadHabitos());
    const [memorias, setMemorias] = useState<Memoria[]>(() => loadMemorias());

    // --- Legacy PetState (for compatibility with existing UI) ---
    const [pet, setPet] = useState<PetState>(() => ({
        name: 'bichinho',
        age: growthPet.idadeEmMinutos,
        mood: Mood.HAPPY,
        hunger: 80,
        happiness: 80,
        energy: growthPet.energia,
        cleanliness: 80,
        satisfaction: Math.round(growthPet.progressoDaFase * 100),
        isSleeping: growthPet.estaDormindo,
        image: '',
        growthStage: ['NEWBORN', 'BABY', 'PUPPY', 'CHILD', 'TEEN'][growthPet.faseAtual - 1] as PetState['growthStage'],
        xp: 0
    }));

    const [users] = useState<Record<UserRole, User>>(defaultUsers);
    const [currentRole, setCurrentRole] = useState<UserRole>(UserRole.USER_A);
    const [isSwitchingUser, setIsSwitchingUser] = useState(false);

    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: '0', sender: 'pet', text: `oiii! eu sou bichinho! ❤️`, timestamp: Date.now() }
    ]);
    const [isThinking, setIsThinking] = useState(false);
    const [isMenuExpanded, setIsMenuExpanded] = useState(false);
    const [activeStats, setActiveStats] = useState<string[]>([]);
    const petRef = useRef<PetState | null>(null);

    useEffect(() => { petRef.current = pet; }, [pet]);

    // --- Process time delta on app load ---
    useEffect(() => {
        const result = processSleepCycles(growthPet, careMetrics);
        const transitionResult = checkPhaseTransition(result.pet, result.metrics);

        setGrowthPet(transitionResult.pet);
        setCareMetrics(transitionResult.metrics);

        savePet(transitionResult.pet);
        updateTimeMetrics(transitionResult.metrics);

        if (transitionResult.transitioned) {
            const phaseName = getPhaseName(transitionResult.pet.faseAtual);
            addMessage({
                id: Date.now().toString(),
                sender: 'pet',
                text: `🎉 eba!! cresci! agora sou ${phaseName}! 🌟`,
                timestamp: Date.now()
            });
            SoundService.playHappy();
        }
    }, []);

    // --- Sync growthPet with legacy pet ---
    useEffect(() => {
        setPet(prev => ({
            ...prev,
            energy: growthPet.energia,
            isSleeping: growthPet.estaDormindo,
            satisfaction: Math.round(growthPet.progressoDaFase * 100),
            growthStage: ['NEWBORN', 'BABY', 'PUPPY', 'CHILD', 'TEEN'][growthPet.faseAtual - 1] as PetState['growthStage'],
        }));
    }, [growthPet]);

    // --- Helpers ---
    const addMessage = (msg: ChatMessage) => {
        setMessages(prev => [...prev, msg]);
    };

    const getAffectedStats = (effects: ItemEffects): string[] => {
        const keys: string[] = [];
        if (effects.satisfaction) keys.push('satisfaction');
        if (effects.hunger) keys.push('hunger');
        if (effects.happiness) keys.push('happiness');
        if (effects.energy) keys.push('energy');
        if (effects.cleanliness) keys.push('cleanliness');
        return keys;
    };

    const triggerStatFocus = (stats: string[]) => {
        setActiveStats(stats);
        setTimeout(() => setActiveStats([]), 2500);
    };

    const triggerLocalResponse = (actionText: string, currentPet: PetState) => {
        setIsThinking(true);
        setTimeout(() => {
            const response = getPetResponse(currentPet, actionText);
            if (response.newMood !== currentPet.mood) {
                if (response.newMood === Mood.HAPPY || response.newMood === Mood.EXCITED) SoundService.playHappy();
                if (response.newMood === Mood.SAD || response.newMood === Mood.ANGRY) SoundService.playSad();
            }
            setPet(prev => prev ? { ...prev, mood: response.newMood } : prev);
            addMessage({
                id: Date.now().toString(),
                sender: 'pet',
                text: response.text,
                timestamp: Date.now()
            });
            setIsThinking(false);
        }, 600);
    };

    // --- Record interaction in growth system ---
    const recordGrowthInteraction = (type: ActivityType) => {
        const newMetrics = recordInteraction(type);
        setCareMetrics(newMetrics);

        // Check progression
        const result = checkPhaseTransition(growthPet, newMetrics);
        setGrowthPet(result.pet);
        savePet(result.pet);

        if (result.transitioned) {
            const phaseName = getPhaseName(result.pet.faseAtual);
            addMessage({
                id: Date.now().toString(),
                sender: 'pet',
                text: `🎉 eba!! cresci! agora sou ${phaseName}! 🌟`,
                timestamp: Date.now()
            });
            SoundService.playHappy();
        }
    };

    // --- Apply personality effects ---
    const applyPersonalityAction = (acao: TipoAcao, eventoDescricao?: string) => {
        // Apply to personality
        const { personalidade: newPers, efeitoBase } = aplicarEfeitoAcao(
            acao, personalidade, temperamento, estadoEmocional
        );
        setPersonalidade(newPers);
        savePersonalidade(newPers);

        // Update emotional state
        const newEstado = atualizarEstadoPorAcao(acao, estadoEmocional, temperamento);
        setEstadoEmocional(newEstado);
        saveEstadoEmocional(newEstado);

        // Record habit if applicable
        if (efeitoBase?.habito) {
            const newHabitos = registrarAcaoHabito(efeitoBase.habito);
            setHabitos(newHabitos);
        }

        // Maybe create memory
        if (efeitoBase?.memoriaChance && eventoDescricao) {
            const emocaoIntensidade = Math.abs(newEstado.felicidade - 50) + Math.abs(newEstado.seguranca - 50);
            if (deveCriarMemoria(efeitoBase.memoriaChance, emocaoIntensidade / 100)) {
                const emocao = newEstado.felicidade > 60 ? 'alegria' :
                    newEstado.frustracao > 60 ? 'frustacao' :
                        newEstado.seguranca < 40 ? 'medo' : 'amor';
                const newMemorias = registrarMemoria(
                    eventoDescricao,
                    emocao,
                    emocaoIntensidade,
                    growthPet.idadeEmMinutos
                );
                setMemorias(newMemorias);
            }
        }
    };

    const handleCookComplete = (food: GameItem, quality: number) => {
        setPet(prev => prev ? StatCalculator.calculate(prev, food.effects) : prev);
        triggerStatFocus(['hunger', 'happiness']);
        SoundService.playHappy();
        addMessage({
            id: Date.now().toString(),
            sender: currentRole,
            text: `fez ${food.name}! ${'⭐'.repeat(quality)} que cheirinho bom!`,
            timestamp: Date.now(),
            isAction: true
        });
        triggerLocalResponse(`cozinhei ${food.name}`, petRef.current!);

        // Record in growth system
        recordGrowthInteraction('cozinhar');

        // Apply personality effect
        applyPersonalityAction('cozinhar', `cozinhou ${food.name} com qualidade ${quality} estrelas`);
    };

    const handleInteraction = async (item: GameItem) => {
        if (!pet || !users || isThinking) return;

        const applyAndRespond = (item: GameItem) => {
            setPet(prev => prev ? StatCalculator.calculate(prev, item.effects) : prev);
            triggerStatFocus(getAffectedStats(item.effects));
            SoundService.playFeed();
            const userMsg: ChatMessage = {
                id: Date.now().toString(),
                sender: currentRole,
                text: item.actionText,
                timestamp: Date.now(),
                isAction: true
            };
            addMessage(userMsg);
            triggerLocalResponse(item.actionText, petRef.current!);
        };

        // Handle FEED from inventory - consume one item
        if (item.type === 'FEED') {
            const consumed = consumeFromInventory(item.id);
            if (!consumed) return;
            SoundService.playFeed();
            recordGrowthInteraction('alimentar');
            applyPersonalityAction('alimentar', `foi alimentado com ${item.name}`);
        } else if (item.type === 'PLAY' || item.type === 'PHOTO') {
            SoundService.playPlay();
            recordGrowthInteraction('brincar');
            applyPersonalityAction('brincar_livre', `brincou: ${item.name}`);
        } else if (item.type === 'CLEAN') {
            recordGrowthInteraction('limpar');
            applyPersonalityAction('limpar', 'tomou banho');
        }

        applyAndRespond(item);
    };

    const handleWakeUp = () => {
        const result = endSleep(growthPet, careMetrics);
        setGrowthPet(result.pet);
        setCareMetrics(result.metrics);
        savePet(result.pet);
        updateTimeMetrics(result.metrics);

        setPet(prev => prev ? { ...prev, isSleeping: false } : prev);
        triggerStatFocus(['energy']);
        addMessage({
            id: Date.now().toString(),
            sender: 'pet',
            text: "bom dia! ☀️ (bocejo)",
            timestamp: Date.now()
        });
        SoundService.playHappy();
    };

    const handleSleep = () => {
        const newGrowthPet = startSleep(growthPet);
        setGrowthPet(newGrowthPet);
        savePet(newGrowthPet);
        setPet(prev => prev ? { ...prev, isSleeping: true } : prev);
    };

    const toggleUser = () => {
        if (isSwitchingUser || pet.isSleeping) return;
        SoundService.playPop();
        setIsSwitchingUser(true);
        setTimeout(() => {
            setCurrentRole(prev => prev === UserRole.USER_A ? UserRole.USER_B : UserRole.USER_A);
            setIsSwitchingUser(false);
        }, 300);
    };

    // Periodic game loop (stats decay)
    useEffect(() => {
        const gameLoop = setInterval(() => {
            setPet(prev => {
                if (!prev) return prev;
                if (prev.isSleeping) {
                    return { ...prev, energy: Math.min(100, prev.energy + 5), hunger: Math.max(0, prev.hunger - 1) };
                }
                return {
                    ...prev,
                    hunger: Math.max(0, prev.hunger - 2),
                    energy: Math.max(0, prev.energy - 1),
                    cleanliness: Math.max(0, prev.cleanliness - 1),
                    happiness: Math.max(0, prev.happiness - (prev.hunger < 30 ? 1 : 0)),
                };
            });
        }, 20000);
        return () => clearInterval(gameLoop);
    }, []);

    return (
        <Routes>
            <Route path="/" element={
                <Home
                    pet={pet} users={users} currentRole={currentRole}
                    messages={messages} isThinking={isThinking}
                    isMenuExpanded={isMenuExpanded} setIsMenuExpanded={setIsMenuExpanded}
                    activeStats={activeStats} onInteraction={handleInteraction}
                    onToggleUser={toggleUser}
                    onWakeUp={handleWakeUp} isSwitchingUser={isSwitchingUser}
                />
            } />
            <Route path="/cooking" element={
                <KitchenPage
                    onCookComplete={handleCookComplete}
                    petPhase={growthPet.faseAtual}
                />
            } />
            <Route path="/profile" element={
                <ProfilePage
                    growthPet={growthPet}
                    careMetrics={careMetrics}
                    temperamento={temperamento}
                    personalidade={personalidade}
                    estadoEmocional={estadoEmocional}
                    habitos={habitos}
                    memorias={memorias}
                />
            } />
        </Routes>
    );
};

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
};

export default App;