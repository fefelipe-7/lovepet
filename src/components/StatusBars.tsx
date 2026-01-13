import React, { useEffect, useState, useRef } from 'react';
import { PetState } from '../types';

interface StatusBarsProps {
    pet: PetState;
    activeStats: string[];
}

// Component to handle the numeric change animation
const StatValueWithDelta = ({ value }: { value: number }) => {
    const [delta, setDelta] = useState<number | null>(null);
    const prevValueRef = useRef(value);

    useEffect(() => {
        const diff = value - prevValueRef.current;
        if (diff !== 0) {
            setDelta(diff);
            prevValueRef.current = value;
            const timer = setTimeout(() => setDelta(null), 2000);
            return () => clearTimeout(timer);
        }
    }, [value]);

    return (
        <div className="relative">
            {delta !== null && (
                <span className={`
                    absolute -top-4 right-0 text-sm font-black animate-bounce
                    ${delta > 0 ? 'text-green-500' : 'text-red-400'}
                `}>
                    {delta > 0 ? `+${delta}` : delta}
                </span>
            )}
            <span className="font-black text-lg">{Math.round(value)}%</span>
        </div>
    );
};

interface StatCardProps {
    id: string;
    label: string;
    value: number;
    icon: string;
    color: string;
    gradientFrom: string;
    gradientTo: string;
    isActive: boolean;
    isMain?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
    id, label, value, icon, color, gradientFrom, gradientTo, isActive, isMain = false
}) => {
    const percentage = Math.min(100, Math.max(0, value));

    if (isMain) {
        return (
            <div className={`
                w-full bg-white rounded-2xl p-4 shadow-lg border-2 transition-all duration-300
                ${isActive ? 'ring-4 ring-yellow-300 scale-[1.02]' : 'border-gray-100'}
            `}>
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className={`
                            w-12 h-12 rounded-xl bg-gradient-to-br ${gradientFrom} ${gradientTo} 
                            flex items-center justify-center text-2xl shadow-sm
                            ${isActive ? 'animate-bounce' : ''}
                        `}>
                            {icon}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-cute-text/60 uppercase tracking-wider">{label}</p>
                            <StatValueWithDelta value={value} />
                        </div>
                    </div>
                </div>

                <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                    <div
                        className={`h-full rounded-full bg-gradient-to-r ${gradientFrom} ${gradientTo} transition-all duration-700 ease-out relative`}
                        style={{ width: `${percentage}%` }}
                    >
                        {isActive && (
                            <div className="absolute inset-0 bg-white/40 animate-pulse"></div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Grid Card
    return (
        <div className={`
            bg-white rounded-xl p-3 shadow-md border-2 transition-all duration-300
            ${isActive ? 'ring-2 ring-yellow-300 scale-105' : 'border-gray-50'}
        `}>
            <div className="flex items-center gap-2 mb-2">
                <div className={`
                    w-8 h-8 rounded-lg bg-gradient-to-br ${gradientFrom} ${gradientTo}
                    flex items-center justify-center text-lg shadow-sm
                    ${isActive ? 'animate-bounce' : ''}
                `}>
                    {icon}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-cute-text/50 uppercase tracking-wider truncate">{label}</p>
                    <p className="text-sm font-black text-cute-text">{Math.round(value)}%</p>
                </div>
            </div>

            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                <div
                    className={`h-full rounded-full bg-gradient-to-r ${gradientFrom} ${gradientTo} transition-all duration-700 ease-out relative`}
                    style={{ width: `${percentage}%` }}
                >
                    {isActive && (
                        <div className="absolute inset-0 bg-white/40 animate-pulse"></div>
                    )}
                </div>
            </div>
        </div>
    );
};

export const StatusBars: React.FC<StatusBarsProps> = ({ pet, activeStats }) => {
    return (
        <div className="w-full px-4 py-3 flex flex-col gap-3">

            {/* Main Stat - Full Width */}
            <StatCard
                id="satisfaction"
                label="Nível de Felicidade"
                value={pet.satisfaction}
                icon="👑"
                color="pink"
                gradientFrom="from-pink-400"
                gradientTo="to-rose-300"
                isActive={activeStats.includes('satisfaction')}
                isMain
            />

            {/* Secondary Stats - 2x2 Grid */}
            <div className="grid grid-cols-2 gap-3 w-full">
                <StatCard
                    id="hunger"
                    label="Fome"
                    value={pet.hunger}
                    icon="🍖"
                    color="orange"
                    gradientFrom="from-orange-400"
                    gradientTo="to-amber-300"
                    isActive={activeStats.includes('hunger')}
                />
                <StatCard
                    id="happiness"
                    label="Amor"
                    value={pet.happiness}
                    icon="💖"
                    color="red"
                    gradientFrom="from-red-400"
                    gradientTo="to-pink-300"
                    isActive={activeStats.includes('happiness')}
                />
                <StatCard
                    id="energy"
                    label="Energia"
                    value={pet.energy}
                    icon="⚡"
                    color="yellow"
                    gradientFrom="from-yellow-400"
                    gradientTo="to-amber-200"
                    isActive={activeStats.includes('energy')}
                />
                <StatCard
                    id="cleanliness"
                    label="Higiene"
                    value={pet.cleanliness}
                    icon="🧼"
                    color="green"
                    gradientFrom="from-green-400"
                    gradientTo="to-emerald-300"
                    isActive={activeStats.includes('cleanliness')}
                />
            </div>
        </div>
    );
};