import React from 'react';
import { PetState, User, UserRole, GameItem } from '../types';
import { StatusBars } from '../components/StatusBars';
import { ActionPanel } from '../components/ActionPanel';
import { Mood } from '../types';
import { useNavigate } from 'react-router-dom';

interface HomeProps {
    pet: PetState;
    users: Record<UserRole, User>;
    currentRole: UserRole;
    messages: any[];
    isThinking: boolean;
    isMenuExpanded: boolean;
    setIsMenuExpanded: (v: boolean) => void;
    activeStats: string[];
    onInteraction: (item: GameItem) => void;
    onToggleUser: () => void;
    onWakeUp: () => void;
    isSwitchingUser: boolean;
}

export const Home: React.FC<HomeProps> = ({
    pet, users, currentRole, messages, isThinking,
    isMenuExpanded, setIsMenuExpanded, activeStats,
    onInteraction, onToggleUser, onWakeUp, isSwitchingUser
}) => {
    const navigate = useNavigate();

    const goToKitchen = () => {
        navigate('/cooking');
    };

    const currentUser = users[currentRole];
    const lastPetMessage = [...messages].reverse().find(m => m.sender === 'pet')?.text || "...";

    return (
        <div className={`h-[100dvh] w-full bg-[#FFF5F7] flex flex-col items-center relative font-nunito text-cute-text overflow-hidden transition-colors duration-1000 ${pet.isSleeping ? 'brightness-50 saturate-50 bg-[#1e1b4b]' : ''}`}>

            {/* --- HEADER --- */}
            <header className="absolute top-2 sm:top-4 w-full px-4 flex justify-center z-50">
                <div className="w-full max-w-[95%] sm:max-w-md bg-white/80 backdrop-blur-md border-2 border-white rounded-[2rem] p-1.5 pr-3 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)] flex items-center gap-2 sm:gap-3 transition-all hover:bg-white/90">

                    {/* Left: Avatar & Switcher */}
                    <button
                        onClick={onToggleUser}
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

                    {/* Middle: Name & Level */}
                    <div className="flex-1 flex flex-col justify-center gap-0.5">
                        <div className="flex justify-between items-end pr-1">
                            <span className="font-extrabold text-cute-text text-xs sm:text-sm leading-none truncate max-w-[100px] lowercase">{currentUser.name}</span>
                            <span className="bg-cute-yellow/40 px-1.5 py-0.5 rounded-md text-[8px] sm:text-[9px] font-bold text-cute-text/60 tracking-tight leading-none lowercase">papai/mamãe</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-cute-pink to-cute-yellow w-[70%] rounded-full"></div>
                        </div>
                    </div>
                </div>
            </header>

            {/* KITCHEN BUTTON */}
            {!pet.isSleeping && (
                <button
                    onClick={goToKitchen}
                    className="absolute top-24 right-4 sm:right-8 w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-2xl sm:text-3xl z-40 border-2 border-orange-300 hover:scale-110 transition-transform animate-bounce-slow"
                    title="Cozinha"
                >
                    👨‍🍳
                </button>
            )}

            {/* PROFILE BUTTON */}
            <button
                onClick={() => navigate('/profile')}
                className="absolute top-24 left-4 sm:left-8 w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-2xl sm:text-3xl z-40 border-2 border-pink-300 hover:scale-110 transition-transform"
                title="Perfil do Bichinho"
            >
                📊
            </button>

            {/* --- MAIN GAME AREA --- */}
            <div className={`
                flex-1 w-full relative flex flex-col items-center min-h-0 transition-all duration-500
                ${isMenuExpanded ? 'justify-end pb-2' : 'justify-between py-24'}
            `}>
                {!isMenuExpanded && <div className="flex-1"></div>}

                <div className="flex flex-col items-center justify-center shrink-0 z-10 w-full">
                    {/* PET VISUALS */}
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
                            </div>
                        )}

                        {pet.isSleeping && (
                            <div className="absolute -top-10 right-0 text-white font-bold text-4xl animate-pulse z-30 lowercase">zzz...</div>
                        )}

                        {/* Pet Sprite */}
                        <div className="w-full h-full relative cursor-pointer group">
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

                    <div className={`
                        w-full px-0 z-20 transition-all duration-500 origin-bottom
                        ${isMenuExpanded ? 'scale-90 mb-0' : 'scale-100 mb-0'}
                    `}>
                        <StatusBars pet={pet} activeStats={activeStats} />
                    </div>
                </div>

                {!isMenuExpanded && <div className="flex-1"></div>}
            </div>

            {/* --- BOTTOM INVENTORY PANEL --- */}
            <div className="w-full relative z-30 shrink-0">
                <ActionPanel
                    onInteract={onInteraction}
                    disabled={isThinking}
                    currentUserRole={currentRole}
                    isSleeping={pet.isSleeping}
                    onWakeUp={onWakeUp}
                    isExpanded={isMenuExpanded}
                    onToggleExpand={() => setIsMenuExpanded(!isMenuExpanded)}
                />
            </div>

        </div>
    );
};
