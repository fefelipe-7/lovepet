import React from 'react';
import { PetState, User, UserRole, GameItem } from '../types';
import { StatusBars } from '../components/StatusBars';
import { ActionPanel } from '../components/ActionPanel';
import { SetupModal } from '../components/SetupModal';
import { Mood } from '../types';
import { useNavigate } from 'react-router-dom';

interface HomeProps {
    pet: PetState | null;
    users: Record<UserRole, User> | null;
    currentRole: UserRole;
    isSetup: boolean;
    messages: any[]; // refine type if possible, or import ChatMessage
    isThinking: boolean;
    isMenuExpanded: boolean;
    setIsMenuExpanded: (v: boolean) => void;
    activeStats: string[];
    onInteraction: (item: GameItem) => void;
    onSetupComplete: (u1: User, u2: User, p: PetState) => void;
    onToggleUser: () => void;
    onWakeUp: () => void;
    isSwitchingUser: boolean;
}

export const Home: React.FC<HomeProps> = ({
    pet, users, currentRole, isSetup, messages, isThinking,
    isMenuExpanded, setIsMenuExpanded, activeStats,
    onInteraction, onSetupComplete, onToggleUser, onWakeUp, isSwitchingUser
}) => {
    const navigate = useNavigate();

    // Use useNavigate to go to kitchen
    const goToKitchen = () => {
        navigate('/cooking');
    };

    if (!isSetup) {
        return <SetupModal onComplete={onSetupComplete} />;
    }

    if (!pet || !users) return null;

    const currentUser = users[currentRole];
    const lastPetMessage = [...messages].reverse().find(m => m.sender === 'pet')?.text || "...";
    const lastActionMsg = [...messages].reverse().find(m => m.isAction && m.sender !== 'pet');
    const lastActionUser = lastActionMsg ? users[lastActionMsg.sender as UserRole] : null;

    return (
        <div className={`h-[100dvh] w-full bg-[#FFF5F7] flex flex-col items-center relative font-nunito text-cute-text overflow-hidden transition-colors duration-1000 ${pet.isSleeping ? 'brightness-50 saturate-50 bg-[#1e1b4b]' : ''}`}>

            {/* --- HEADER --- */}
            <header className="absolute top-2 sm:top-4 w-full px-4 flex justify-center z-50">
                <div className="w-full max-w-[95%] sm:max-w-md bg-white/80 backdrop-blur-md border-2 border-white rounded-[2rem] p-1.5 pr-3 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)] flex items-center gap-2 sm:gap-3 transition-all hover:bg-white/90">
                    {/* ... (Copy header content from App.tsx) ... */}
                    {/* Simplified for brevity in this extraction, will copy full content in replace step or use view_file to get it exact */}

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
                    </button>

                    {/* Middle: Stats */}
                    <div className="flex-1 flex flex-col justify-center gap-0.5">
                        <div className="flex justify-between items-end pr-1">
                            <span className="font-extrabold text-cute-text text-xs sm:text-sm leading-none truncate max-w-[100px] lowercase">{currentUser.name}</span>
                            <span className="bg-cute-yellow/40 px-1.5 py-0.5 rounded-md text-[8px] sm:text-[9px] font-bold text-cute-text/60 tracking-tight leading-none lowercase">lvl 3</span>
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

                        {/* Pet Sprite */}
                        <div className="w-full h-full relative cursor-pointer group">
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
                    disabled={isThinking || (pet.isSleeping && !pet.isSleeping)}
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
