import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { User, PetState, ChatMessage, UserRole, Mood, GameItem, ItemEffects } from './types';
import { StatCalculator } from './services/gameLogic/StatCalculator';
import { getPetResponse } from './services/petResponseService';
import { SoundService } from './services/soundService';
import { Home } from './pages/Home';
import { KitchenPage } from './pages/Kitchen';
import { consumeFromInventory } from './services/cooking/inventoryService';

const AppContent: React.FC = () => {
    // --- HARDCODED USERS ---
    const defaultUsers: Record<UserRole, User> = {
        [UserRole.USER_A]: { name: 'fefe', avatar: '👨' },
        [UserRole.USER_B]: { name: 'nana', avatar: '👩' }
    };

    const defaultPet: PetState = {
        name: 'bichinho',
        age: 1,
        mood: Mood.HAPPY,
        hunger: 80,
        happiness: 80,
        energy: 80,
        cleanliness: 80,
        satisfaction: 80,
        isSleeping: false,
        image: '',
        growthStage: 'BABY',
        xp: 0
    };

    // --- State ---
    const [users] = useState<Record<UserRole, User>>(defaultUsers);
    const [pet, setPet] = useState<PetState>(defaultPet);
    const [currentRole, setCurrentRole] = useState<UserRole>(UserRole.USER_A);
    const [isSwitchingUser, setIsSwitchingUser] = useState(false);

    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: '0', sender: 'pet', text: `oiii! eu sou ${defaultPet.name}! ❤️`, timestamp: Date.now() }
    ]);
    const [isThinking, setIsThinking] = useState(false);
    const [isMenuExpanded, setIsMenuExpanded] = useState(false);
    const [activeStats, setActiveStats] = useState<string[]>([]);
    const petRef = useRef<PetState | null>(null);

    useEffect(() => { petRef.current = pet; }, [pet]);

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
            setPet(prev => prev ? { ...prev, mood: response.newMood } : null);
            addMessage({
                id: Date.now().toString(),
                sender: 'pet',
                text: response.text,
                timestamp: Date.now()
            });
            setIsThinking(false);
        }, 600);
    };

    const handleCookComplete = (food: GameItem, quality: number) => {
        setPet(prev => prev ? StatCalculator.calculate(prev, food.effects) : null);
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
    };

    const handleInteraction = async (item: GameItem) => {
        if (!pet || !users || isThinking) return;

        const applyAndRespond = (item: GameItem) => {
            setPet(prev => prev ? StatCalculator.calculate(prev, item.effects) : null);
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
            if (!consumed) {
                // No more of this item
                return;
            }
            SoundService.playFeed();
        } else if (item.type === 'PLAY' || item.type === 'PHOTO') {
            SoundService.playPlay();
        }

        applyAndRespond(item);
    };

    const handleWakeUp = () => {
        setPet(prev => prev ? { ...prev, isSleeping: false } : null);
        triggerStatFocus(['energy']);
        addMessage({
            id: Date.now().toString(),
            sender: 'pet',
            text: "bom dia! ☀️ (bocejo)",
            timestamp: Date.now()
        });
        SoundService.playHappy();
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


    useEffect(() => {
        const gameLoop = setInterval(() => {
            setPet(prev => {
                if (!prev) return null;
                if (prev.isSleeping) {
                    return { ...prev, energy: Math.min(100, prev.energy + 5), hunger: Math.max(0, prev.hunger - 1) };
                }
                return {
                    ...prev,
                    hunger: Math.max(0, prev.hunger - 2),
                    energy: Math.max(0, prev.energy - 1),
                    cleanliness: Math.max(0, prev.cleanliness - 1),
                    happiness: Math.max(0, prev.happiness - (prev.hunger < 30 ? 1 : 0)),
                    satisfaction: Math.max(0, prev.satisfaction - 1)
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
                    petPhase={pet.growthStage === 'NEWBORN' ? 1 :
                        pet.growthStage === 'BABY' ? 2 :
                            pet.growthStage === 'PUPPY' ? 3 :
                                pet.growthStage === 'CHILD' ? 4 : 5}
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