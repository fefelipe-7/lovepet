import { GameItem } from '../../types';

export const SLEEP_ITEMS: GameItem[] = [
    {
        id: 'light_off', name: 'apagar luz', icon: '🌚', actionText: 'apagar a luz', type: 'SLEEP',
        effects: { energy: 0, hunger: 0, happiness: 0, satisfaction: 0 } // Triggers Sleep Mode
    },
    {
        id: 'song', name: 'canção', icon: '🎵', actionText: 'cantar canção de ninar', type: 'SLEEP',
        effects: { energy: 10, happiness: 20, satisfaction: 15 } // Relaxa sem dormir totalmente
    },
    {
        id: 'blanket', name: 'cobertor', icon: '🛌', actionText: 'cobrir com cobertor', type: 'SLEEP',
        effects: { energy: 5, happiness: 25, satisfaction: 20 }
    },
];
