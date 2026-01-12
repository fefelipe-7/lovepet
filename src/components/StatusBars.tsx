import React, { useEffect, useState, useRef } from 'react';
import { PetState } from '../types';

interface StatusBarsProps {
  pet: PetState;
  activeStats: string[];
}

// Component to handle the numeric change animation
const StatValueWithDelta = ({ value, label, compact = false }: { value: number, label: string, compact?: boolean }) => {
    const [delta, setDelta] = useState<number | null>(null);
    const prevValueRef = useRef(value);
    
    useEffect(() => {
        const diff = value - prevValueRef.current;
        if (diff !== 0) {
            setDelta(diff);
            prevValueRef.current = value;
            
            // Clear delta after animation
            const timer = setTimeout(() => {
                setDelta(null);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [value]);

    return (
        <div className="flex items-center justify-end relative min-w-[2rem]">
             {/* Floating Delta Animation */}
             {delta !== null && (
                <span className={`
                    absolute -top-3 right-0 text-xs font-black animate-pop shadow-white drop-shadow-md
                    ${delta > 0 ? 'text-green-500' : 'text-red-400'}
                `}>
                    {delta > 0 ? `+${delta}` : delta}
                </span>
            )}
            <span className={`font-black text-cute-text/80 ${compact ? 'text-[10px]' : 'text-xs'}`}>{Math.round(value)}%</span>
        </div>
    );
};

const ProgressBar = ({ 
    value, 
    color, 
    isActive,
    height = "h-3"
}: { 
    value: number, 
    color: string, 
    isActive: boolean,
    height?: string
}) => (
    <div className={`flex-1 ${height} bg-gray-100 rounded-full overflow-hidden shadow-inner relative ring-1 ring-black/5`}>
        <div 
            className={`h-full rounded-full ${color} transition-all duration-700 ease-out relative flex items-center justify-end`}
            style={{ width: `${value}%` }}
        >
            {isActive && (
                 <div className="absolute inset-0 bg-white/30 w-full animate-[shimmer_1s_infinite]"></div>
            )}
        </div>
    </div>
);

const StatItem = ({ 
    id, 
    label,
    value, 
    icon, 
    color, 
    activeStats,
    isGrid = false
}: { 
    id: string, 
    label: string,
    value: number, 
    icon: string, 
    color: string, 
    activeStats: string[],
    isGrid?: boolean
}) => {
    const isActive = activeStats.includes(id);

    if (isGrid) {
        return (
            <div className={`
                bg-white rounded-xl p-2 shadow-sm border border-indigo-50 flex flex-col gap-1.5 justify-center
                transition-transform duration-300 ${isActive ? 'scale-[1.02] ring-2 ring-cute-pink/50 z-10' : ''}
            `}>
                <div className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-1.5 overflow-hidden">
                        <span className={`flex-shrink-0 ${isActive ? 'animate-bounce' : ''}`}>{icon}</span>
                        <span className="text-[10px] font-bold text-cute-text tracking-wider truncate lowercase">{label}</span>
                    </div>
                    <StatValueWithDelta value={value} label={label} compact />
                </div>
                <ProgressBar value={value} color={color} isActive={isActive} height="h-2" />
            </div>
        );
    }

    // Full Width Layout (For Satisfaction/Main Stat)
    return (
        <div className={`
            w-full bg-white rounded-xl p-2 px-3 shadow-sm border border-indigo-50 flex items-center gap-3
            transition-transform duration-300 ${isActive ? 'scale-[1.02] ring-2 ring-cute-pink/50 z-10' : ''}
        `}>
            <div className={`text-xl flex-shrink-0 ${isActive ? 'animate-bounce' : ''}`}>{icon}</div>
            
            <div className="flex-1 flex items-center gap-3">
                 <span className="text-[10px] font-bold text-cute-text tracking-wider w-14 truncate lowercase">{label}</span>
                 <ProgressBar value={value} color={color} isActive={isActive} />
                 <StatValueWithDelta value={value} label={label} />
            </div>
        </div>
    );
};

export const StatusBars: React.FC<StatusBarsProps> = ({ pet, activeStats }) => {
  return (
    <div className="w-full bg-white/40 backdrop-blur-md p-3 border-y border-white/60 shadow-sm flex flex-col gap-2">
        
        {/* Main Stat - Full Width */}
        <StatItem 
            id="satisfaction" 
            label="nível"
            value={pet.satisfaction} 
            icon="👑" 
            color="bg-gradient-to-r from-[#FF9AA2] to-[#FFB7B2]" 
            activeStats={activeStats}
        />
        
        {/* Secondary Stats - 2x2 Grid */}
        <div className="grid grid-cols-2 gap-2 w-full">
            <StatItem 
                id="hunger" 
                label="fome"
                value={pet.hunger} 
                icon="🍖" 
                color="bg-[#FFB7B2]" 
                activeStats={activeStats}
                isGrid
            />
            <StatItem 
                id="happiness" 
                label="amor"
                value={pet.happiness} 
                icon="💖" 
                color="bg-[#FF9AA2]" 
                activeStats={activeStats}
                isGrid
            />
            <StatItem 
                id="energy" 
                label="energia"
                value={pet.energy} 
                icon="⚡" 
                color="bg-[#FFDAC1]" 
                activeStats={activeStats}
                isGrid
            />
            <StatItem 
                id="cleanliness" 
                label="higiene"
                value={pet.cleanliness} 
                icon="🧼" 
                color="bg-[#B5EAD7]" 
                activeStats={activeStats}
                isGrid
            />
        </div>
        
        <style>{`
            @keyframes shimmer {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }
        `}</style>
    </div>
  );
};