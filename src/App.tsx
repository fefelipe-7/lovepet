import React, { useState, useEffect, useRef } from 'react';
import { User, PetState, ChatMessage, UserRole, Mood, GameItem, ItemEffects } from './types';
import { getPetResponse } from './services/petResponseService';
import { SoundService } from './services/soundService';
import { StatusBars } from './components/StatusBars';
import { ActionPanel } from './components/ActionPanel';
import { SetupModal } from './components/SetupModal';

const App: React.FC = () => {
    // --- State ---
    const [isSetup, setIsSetup] = useState(false);
    const [users, setUsers] = useState<Record<UserRole, User> | null>(null);
    const [currentRole, setCurrentRole] = useState<UserRole>(UserRole.USER_A);
    const [isSwitchingUser, setIsSwitchingUser] = useState(false);

    const [pet, setPet] = useState<PetState | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isThinking, setIsThinking] = useState(false);

    // Menu State lifted up to control layout
    const [isMenuExpanded, setIsMenuExpanded] = useState(false);

    // State for Status Bar Focus Animation
    const [activeStats, setActiveStats] = useState<string[]>([]);

    // --- Refs for Game Loop ---
    const petRef = useRef<PetState | null>(null);
    useEffect(() => { petRef.current = pet; }, [pet]);

    // --- Helpers ---
    const addMessage = (msg: ChatMessage) => {
        setMessages(prev => [...prev, msg]);
    };

    // Helper to determine which stats changed
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

    const applyStatChanges = (prev: PetState, effects: ItemEffects): PetState => {
        const applyChange = (current: number, change: number | undefined) => {
            if (!change) return current;
            return Math.max(0, Math.min(100, current + change));
        };

        const newHunger = applyChange(prev.hunger, effects.hunger);
        const newEnergy = applyChange(prev.energy, effects.energy);
        const newCleanliness = applyChange(prev.cleanliness, effects.cleanliness);
        const newHappiness = applyChange(prev.happiness, effects.happiness);

        const bonusSatisfaction = effects.satisfaction || 0;
        const newSatisfaction = applyChange(prev.satisfaction, bonusSatisfaction);

        return {
            ...prev,
            hunger: newHunger,
            energy: newEnergy,
            cleanliness: newCleanliness,
            happiness: newHappiness,
            satisfaction: newSatisfaction
        };
    };

    // Removed triggerImageGeneration - using static assets/emojis for now

    const triggerLocalResponse = (actionText: string, currentPet: PetState) => {
        setIsThinking(true);

        // Simulate small delay for "thinking" feel
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

    // --- INDEPENDENT SYSTEMS HANDLERS ---

    const handleFoodSystem = (item: GameItem) => {
        SoundService.playFeed();
        setPet(prev => prev ? applyStatChanges(prev, item.effects) : null);

        triggerStatFocus(getAffectedStats(item.effects));

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

    const handleCleanSystem = (item: GameItem) => {
        SoundService.playClean();
        setPet(prev => prev ? applyStatChanges(prev, item.effects) : null);

        triggerStatFocus(getAffectedStats(item.effects));

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

    const handlePlaySystem = async (item: GameItem) => {
        SoundService.playPlay();

        // MINIGAME LOGIC: Pedra Papel Tesoura
        if (item.minigame === 'RPS') {
            const moves = ['Pedra ✊', 'Papel ✋', 'Tesoura ✌️'];
            const userMove = moves[Math.floor(Math.random() * 3)];
            const petMove = moves[Math.floor(Math.random() * 3)];

            let result = "";
            let happinessChange = 0;
            let text = "";

            if (userMove === petMove) {
                result = "Empate!";
                happinessChange = 5;
                text = `Nós dois escolhemos ${petMove}! Empate! 😄`;
            } else if (
                (userMove === 'Pedra ✊' && petMove === 'Tesoura ✌️') ||
                (userMove === 'Papel ✋' && petMove === 'Pedra ✊') ||
                (userMove === 'Tesoura ✌️' && petMove === 'Papel ✋')
            ) {
                result = "Você ganhou!";
                happinessChange = 15;
                text = `Arf! Você escolheu ${userMove} e eu ${petMove}. Você venceu! 🏆`;
            } else {
                result = "Pet ganhou!";
                happinessChange = 20;
                text = `Haha! Eu escolhi ${petMove} e venci seu ${userMove}! Sou campeão! 🥇`;
            }

            const effects = { ...item.effects, happiness: happinessChange, satisfaction: 10 };
            setPet(prev => prev ? applyStatChanges(prev, effects) : null);
            triggerStatFocus(['happiness', 'satisfaction']);

            addMessage({
                id: Date.now().toString(),
                sender: currentRole,
                text: "jogou jokenpô!",
                timestamp: Date.now(),
                isAction: true
            });

            addMessage({
                id: (Date.now() + 1).toString(),
                sender: 'pet',
                text: text,
                timestamp: Date.now()
            });
            return;
        }

        // Standard Play
        if (item.type === 'PHOTO') {
            SoundService.playPop();
            triggerStatFocus(['satisfaction', 'happiness']);
            addMessage({
                id: Date.now().toString(),
                sender: currentRole,
                text: item.actionText,
                timestamp: Date.now(),
                isAction: true
            });
            addMessage({
                id: (Date.now() + 1).toString(),
                sender: 'pet',
                text: "Xissss! 📸",
                timestamp: Date.now()
            });
            // Removed image generation trigger
            return;
        }

        setPet(prev => prev ? applyStatChanges(prev, item.effects) : null);
        triggerStatFocus(getAffectedStats(item.effects));

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

    const handleSleepSystem = (item: GameItem) => {
        // Toggle Sleep Mode if "Light Off"
        if (item.id === 'light_off') {
            setPet(prev => prev ? { ...prev, isSleeping: true } : null);
            triggerStatFocus(['energy']);
            addMessage({
                id: Date.now().toString(),
                sender: currentRole,
                text: "apagou a luz...",
                timestamp: Date.now(),
                isAction: true
            });
            SoundService.playPop(); // Gentle sound
            return;
        }

        // Standard relax items (songs, blankets)
        setPet(prev => prev ? applyStatChanges(prev, item.effects) : null);
        triggerStatFocus(getAffectedStats(item.effects));

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


    // --- MAIN ORCHESTRATOR ---

    const handleInteraction = async (item: GameItem) => {
        if (!pet || !users || isThinking) return;

        // const currentUser = users[currentRole]; // Not strictly used in local logic but kept if needed later

        switch (item.type) {
            case 'FEED':
                handleFoodSystem(item);
                break;
            case 'CLEAN':
                handleCleanSystem(item);
                break;
            case 'PLAY':
            case 'PHOTO': // Photo is part of Play system visually
                await handlePlaySystem(item);
                break;
            case 'SLEEP':
                handleSleepSystem(item);
                break;
        }
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

    const handleSetupComplete = (u1: User, u2: User, initialPet: PetState) => {
        setUsers({
            [UserRole.USER_A]: u1,
            [UserRole.USER_B]: u2
        });
        setPet(initialPet);
        setIsSetup(true);
        SoundService.playHappy();

        // Initial greeting
        addMessage({
            id: Date.now().toString(),
            sender: 'pet',
            text: `oiii! eu sou ${initialPet.name}! ❤️`,
            timestamp: Date.now()
        });
    };

    const toggleUser = () => {
        if (isSwitchingUser || pet?.isSleeping) return;
        SoundService.playPop();
        setIsSwitchingUser(true);

        // Wait for fade out, then switch
        setTimeout(() => {
            setCurrentRole(prev => prev === UserRole.USER_A ? UserRole.USER_B : UserRole.USER_A);
            setIsSwitchingUser(false);
        }, 300);
    };

    // --- Game Loop (Stat Decay & Sleep Recovery) ---
    useEffect(() => {
        if (!isSetup) return;

        const gameLoop = setInterval(() => {
            setPet(prev => {
                if (!prev) return null;

                // SLEEP SYSTEM: RECOVERY
                if (prev.isSleeping) {
                    const newEnergy = Math.min(100, prev.energy + 5);
                    // While sleeping, hunger grows slower, happiness stable
                    const newHunger = Math.max(0, prev.hunger - 1);
                    return { ...prev, energy: newEnergy, hunger: newHunger };
                }

                // AWAKE SYSTEM: DECAY
                const hungerDecay = 2;
                const cleanlinessDecay = 1;
                const satisfactionDecay = 1;

                let energyDecay = 1;
                if (prev.hunger < 30) energyDecay += 2;

                const newHunger = Math.max(0, prev.hunger - hungerDecay);
                const newEnergy = Math.max(0, prev.energy - energyDecay);
                const newCleanliness = Math.max(0, prev.cleanliness - cleanlinessDecay);
                const newSatisfaction = Math.max(0, prev.satisfaction - satisfactionDecay);

                let loveDecay = 0;
                if (newHunger < 30) loveDecay += 1;
                if (newCleanliness < 30) loveDecay += 1;
                if (newEnergy < 20) loveDecay += 1;

                const newHappiness = Math.max(0, prev.happiness - loveDecay);

                return {
                    ...prev,
                    hunger: newHunger,
                    energy: newEnergy,
                    cleanliness: newCleanliness,
                    happiness: newHappiness,
                    satisfaction: newSatisfaction
                };
            });
        }, 20000); // Loop every 20s

        return () => clearInterval(gameLoop);
    }, [isSetup]);


    if (!isSetup) {
        return <SetupModal onComplete={handleSetupComplete} />;
    }

    if (!pet || !users) return null;

    const currentUser = users[currentRole];
    const lastPetMessage = [...messages].reverse().find(m => m.sender === 'pet')?.text || "...";

    // Find last USER action
    const lastActionMsg = [...messages].reverse().find(m => m.isAction && m.sender !== 'pet');
    const lastActionUser = lastActionMsg ? users[lastActionMsg.sender as UserRole] : null;

    return (
        // Solid background color applied here, removing 'bg-room'
        <div className={`h-[100dvh] w-full bg-[#FFF5F7] flex flex-col items-center relative font-nunito text-cute-text overflow-hidden transition-colors duration-1000 ${pet.isSleeping ? 'brightness-50 saturate-50 bg-[#1e1b4b]' : ''}`}>

            {/* --- UNIFIED COMPACT HEADER --- */}
            <header className="absolute top-2 sm:top-4 w-full px-4 flex justify-center z-50">
                <div className="w-full max-w-[95%] sm:max-w-md bg-white/80 backdrop-blur-md border-2 border-white rounded-[2rem] p-1.5 pr-3 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)] flex items-center gap-2 sm:gap-3 transition-all hover:bg-white/90">

                    {/* Left: Avatar & Switcher */}
                    <button
                        onClick={toggleUser}
                        className="relative group flex-shrink-0"
                        title="trocar usuário"
                        disabled={pet.isSleeping}
                    >
                        <div className={`
                    w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-lg sm:text-xl 
                    transition-all duration-300 ease-in-out
                    ${currentRole === UserRole.USER_A ? 'bg-cute-pink' : 'bg-cute-blue'}
                    ${isSwitchingUser ? 'scale-0 opacity-0 rotate-180' : 'scale-100 opacity-100 rotate-0'}
                `}>
                            {currentUser.avatar}
                        </div>
                        {!pet.isSleeping && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full flex items-center justify-center text-[9px] sm:text-[10px] shadow-sm border border-gray-100 text-cute-text/60 group-hover:scale-110 transition-transform">
                                🔄
                            </div>
                        )}
                    </button>

                    {/* Middle: Stats & Info */}
                    <div className="flex-1 flex flex-col justify-center gap-0.5">
                        <div className="flex justify-between items-end pr-1">
                            <span className="font-extrabold text-cute-text text-xs sm:text-sm leading-none truncate max-w-[100px] lowercase">{currentUser.name}</span>
                            <span className="bg-cute-yellow/40 px-1.5 py-0.5 rounded-md text-[8px] sm:text-[9px] font-bold text-cute-text/60 tracking-tight leading-none lowercase">lvl 3</span>
                        </div>

                        {/* XP Bar */}
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-cute-pink to-cute-yellow w-[70%] rounded-full"></div>
                        </div>
                    </div>

                    {/* Right: Currency & Menu */}
                    <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-3 border-l border-gray-200/60 h-8">
                        <div className="flex flex-col items-end leading-none">
                            <div className="flex items-center gap-1">
                                <span className="text-[10px]">💎</span>
                                <span className="text-xs font-black text-cute-text/70">150</span>
                            </div>
                        </div>

                        <button className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 flex items-center justify-center text-cute-text/50 transition-all active:scale-95 active:rotate-90">
                            ⚙️
                        </button>
                    </div>
                </div>
            </header>

            {/* --- MAIN GAME AREA --- */}
            <div className={`
        flex-1 w-full relative flex flex-col items-center min-h-0 transition-all duration-500
        ${isMenuExpanded ? 'justify-end pb-2' : 'justify-between py-24'}
      `}>

                {/* Spacer for collapsed mode to center content vertically relative to available space */}
                {!isMenuExpanded && <div className="flex-1"></div>}

                <div className="flex flex-col items-center justify-center shrink-0 z-10 w-full">
                    {/* Pet Image Area - Dynamic Scaling */}
                    <div className={`
                relative flex-shrink-0 transition-all duration-500 ease-in-out
                ${isMenuExpanded ? 'w-32 h-32 mb-1' : 'w-48 h-48 sm:w-64 sm:h-64 mb-6'}
            `}>
                        {/* Speech Bubble */}
                        {!pet.isSleeping && (
                            <div className={`
                        absolute bg-white p-3 rounded-2xl rounded-bl-none shadow-md border-2 border-cute-text/10 animate-pop z-30 transition-all duration-300
                        ${isMenuExpanded ? '-top-12 -right-16 w-32 scale-90' : '-top-16 -right-6 sm:-top-24 sm:-right-10 w-40 sm:w-48'}
                    `}>
                                <p className="text-xs sm:text-sm font-bold text-cute-text leading-tight line-clamp-3 lowercase">{lastPetMessage}</p>
                                {isThinking && <span className="absolute bottom-2 right-2 flex gap-1">
                                    <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-cute-pink rounded-full animate-bounce"></span>
                                    <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-cute-pink rounded-full animate-bounce delay-75"></span>
                                    <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-cute-pink rounded-full animate-bounce delay-150"></span>
                                </span>}
                            </div>
                        )}

                        {pet.isSleeping && (
                            <div className="absolute -top-10 right-0 text-white font-bold text-4xl animate-pulse z-30 lowercase">zzz...</div>
                        )}

                        <div className="w-full h-full relative cursor-pointer group">
                            {!pet.isSleeping && pet.cleanliness > 90 && (
                                <div className="absolute inset-0 pointer-events-none z-20">
                                    <div className="absolute bottom-0 left-10 text-xl animate-bubble-rise opacity-0">🫧</div>
                                    <div className="absolute bottom-4 right-10 text-lg animate-bubble-rise opacity-0" style={{ animationDelay: '1s' }}>🫧</div>
                                </div>
                            )}

                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 sm:w-40 h-6 sm:h-8 bg-black/10 rounded-[100%] blur-sm"></div>

                            {pet.image ? (
                                <img
                                    src={pet.image}
                                    alt="Pet"
                                    className={`w-full h-full object-contain mix-blend-multiply drop-shadow-xl transition-transform duration-500
                            ${pet.mood === Mood.HAPPY && !pet.isSleeping ? 'animate-bounce-slow' : 'animate-float'}
                            ${isThinking ? 'scale-95 blur-[1px]' : 'scale-100'}
                            ${pet.isSleeping ? 'opacity-80 scale-95 translate-y-4 grayscale-[0.3]' : ''}
                        `}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-6xl sm:text-8xl animate-bounce">🥚</div>
                            )}

                            {!pet.isSleeping && (
                                <div className="absolute -top-2 -left-2 sm:-top-4 sm:-left-4 bg-white p-1.5 sm:p-2 rounded-full shadow-md text-xl sm:text-2xl animate-wiggle">
                                    {pet.mood === Mood.HAPPY ? '🥰' :
                                        pet.mood === Mood.SAD ? '😢' :
                                            pet.mood === Mood.ANGRY ? '😠' :
                                                pet.mood === Mood.SLEEPY ? '😴' :
                                                    pet.mood === Mood.EXCITED ? '🤩' : '😐'}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Status Bars - Scale slightly when menu is expanded to save space */}
                    {/* REMOVED PADDING AND MAX-WIDTH HERE */}
                    <div className={`
                w-full px-0 z-20 transition-all duration-500 origin-bottom
                ${isMenuExpanded ? 'scale-90 mb-0' : 'scale-100 mb-0'}
            `}>
                        <StatusBars pet={pet} activeStats={activeStats} />
                    </div>
                </div>

                {/* Spacer for collapsed mode */}
                {!isMenuExpanded && <div className="flex-1"></div>}

                {/* Last Action Card - ONLY shows when menu is COLLAPSED */}
                {!isMenuExpanded && lastActionMsg && lastActionUser && !pet.isSleeping && (
                    <div className="w-full px-4 max-w-sm z-10 animate-fade-in-up mb-4 shrink-0">
                        <div className="bg-white/50 backdrop-blur-sm border-2 border-white/60 rounded-2xl p-3 flex items-center gap-3 shadow-sm hover:bg-white/70 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-xl shrink-0 border border-gray-100">
                                {lastActionUser.avatar}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-cute-text font-bold truncate lowercase">
                                    <span className="text-cute-pink lowercase">{lastActionUser.name}</span> {lastActionMsg.text}
                                </p>
                            </div>
                            <div className="text-[10px] font-bold text-cute-text/40 shrink-0 bg-white/50 px-2 py-1 rounded-lg">
                                {new Date(lastActionMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    </div>
                )}

            </div>

            {/* --- BOTTOM INVENTORY PANEL --- */}
            <div className="w-full relative z-30 shrink-0">
                <ActionPanel
                    onInteract={handleInteraction}
                    disabled={isThinking || (pet.isSleeping && !pet.isSleeping)}
                    currentUserRole={currentRole}
                    isSleeping={pet.isSleeping}
                    onWakeUp={handleWakeUp}
                    isExpanded={isMenuExpanded}
                    onToggleExpand={() => setIsMenuExpanded(!isMenuExpanded)}
                />
            </div>

        </div>
    );
};

export default App;