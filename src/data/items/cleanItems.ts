import { GameItem } from '../../types';

export const CLEAN_ITEMS: GameItem[] = [
    {
        id: 'sponge', name: 'esponja', icon: '🧽', actionText: 'limpar com esponja', type: 'CLEAN',
        effects: { cleanliness: 25, happiness: -2, satisfaction: 5 }
    },
    {
        id: 'shower', name: 'banho', icon: '🚿', actionText: 'dar um banho completo', type: 'CLEAN',
        effects: { cleanliness: 100, energy: -10, happiness: 10, satisfaction: 20 }
    },
    {
        id: 'dryer', name: 'secador', icon: '🌬️', actionText: 'secar o pelo', type: 'CLEAN',
        effects: { cleanliness: 10, happiness: 15, satisfaction: 10 }
    },
    {
        id: 'brush', name: 'escova', icon: '🖌️', actionText: 'escovar o pelo', type: 'CLEAN',
        effects: { cleanliness: 15, happiness: 20, satisfaction: 10 }
    },
    {
        id: 'perfume', name: 'perfume', icon: '🌸', actionText: 'passar perfume', type: 'CLEAN',
        effects: { cleanliness: 5, happiness: 10, satisfaction: 15 }
    },
];
