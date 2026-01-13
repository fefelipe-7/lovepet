import React, { useEffect, useState, useRef } from 'react';
import { PetState } from '../types';

interface StatusBarsProps {
    pet: PetState;
    activeStats: string[];
}

const StatValueWithDelta = ({ value }: { value: number }) => {
    const [delta, setDelta] = useState<number | null>(null);
    const prevValueRef = useRef(value);

    useEffect(() => {
        const diff = value - prevValueRef.current;
        if (diff !== 0) {
            setDelta(diff);
            prevValueRef.current = value;
            const timer = setTimeout(() => setDelta(null), 1500);
            return () => clearTimeout(timer);
        }
    }, [value]);

    return (
        <div className="relative flex items-center gap-1">
            {delta !== null && (
                <span className={`
                    absolute -top-3 right-0 text-[10px] font-bold animate-fade-up
                    ${delta > 0 ? 'text-green-500' : 'text-red-400'}
                `}>
                    {delta > 0 ? `+${delta}` : delta}
                </span>
            )}
            <span className="text-xs font-bold text-cute-text/70">{Math.round(value)}</span>
        </div>
    );
};

interface StatRowProps {
    icon: string;
    label: string;
    value: number;
    color: string;
    isActive: boolean;
    isMain?: boolean;
}

const StatRow: React.FC<StatRowProps> = ({ icon, label, value, color, isActive, isMain = false }) => {
    const percentage = Math.min(100, Math.max(0, value));

    return (
        <div className={`
            flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300
            ${isMain ? 'bg-white/80 shadow-sm' : 'bg-white/40'}
            ${isActive ? 'scale-[1.02] bg-white/90' : ''}
        `}>
            <span className={`text-base ${isActive ? 'animate-pulse' : ''}`}>{icon}</span>
            <div className="flex-1 flex flex-col gap-0.5">
                <div className="flex justify-between items-center">
                    <span className="text-[10px] font-semibold text-cute-text/60 uppercase tracking-wide">{label}</span>
                    <StatValueWithDelta value={value} />
                </div>
                <div className="h-1.5 bg-black/5 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-500 ease-out ${color}`}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

export const StatusBars: React.FC<StatusBarsProps> = ({ pet, activeStats }) => {
    return (
        <div className="w-full px-3 py-2">
            <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-2 space-y-1.5 border border-white/50">
                {/* Main Stat */}
                <StatRow
                    icon="💖"
                    label="Felicidade"
                    value={pet.satisfaction}
                    color="bg-gradient-to-r from-pink-400 to-rose-300"
                    isActive={activeStats.includes('satisfaction')}
                    isMain
                />

                {/* Secondary Stats Grid */}
                <div className="grid grid-cols-2 gap-1.5">
                    <StatRow
                        icon="🍖"
                        label="Fome"
                        value={pet.hunger}
                        color="bg-orange-400"
                        isActive={activeStats.includes('hunger')}
                    />
                    <StatRow
                        icon="❤️"
                        label="Amor"
                        value={pet.happiness}
                        color="bg-red-400"
                        isActive={activeStats.includes('happiness')}
                    />
                    <StatRow
                        icon="⚡"
                        label="Energia"
                        value={pet.energy}
                        color="bg-yellow-400"
                        isActive={activeStats.includes('energy')}
                    />
                    <StatRow
                        icon="✨"
                        label="Higiene"
                        value={pet.cleanliness}
                        color="bg-emerald-400"
                        isActive={activeStats.includes('cleanliness')}
                    />
                </div>
            </div>
        </div>
    );
};