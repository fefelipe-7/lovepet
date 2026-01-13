import { GameItem } from '../../types';

export const SLEEP_ITEMS: GameItem[] = [
    {
        id: 'light_off', name: 'apagar luz', icon: '🌚', actionText: 'apagar a luz', type: 'SLEEP',
        effects: { energy: 0, happiness: 0, satisfaction: 0 } // Triggers Sleep Mode
    },
    {
        id: 'song', name: 'canção', icon: '🎵', actionText: 'cantar canção de ninar', type: 'SLEEP',
        effects: { energy: 5, happiness: 15, satisfaction: 10 }
    },
    {
        id: 'blanket', name: 'cobertor', icon: '🛌', actionText: 'cobrir com cobertor', type: 'SLEEP',
        effects: { energy: 5, happiness: 20, satisfaction: 15 }
    },
];
