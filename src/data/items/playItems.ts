import { GameItem } from '../../types';

export const PLAY_ITEMS: GameItem[] = [
    // --- MINIGAMES ---
    {
        id: 'rps', name: 'jokenpô', icon: '✊✋✌️', actionText: 'jogar pedra, papel e tesoura', type: 'PLAY',
        effects: { happiness: 0, energy: -10 }, // Effects handled dynamically by game result
        minigame: 'RPS'
    },
    {
        id: 'reading', name: 'leitura', icon: '📚', actionText: 'ir para biblioteca', type: 'PLAY',
        effects: { happiness: 0, energy: 0 }, // Effects handled by reading page
        minigame: 'READING'
    },
    // --- CLÁSSICOS ---
    {
        id: 'ball', name: 'bola', icon: '⚽', actionText: 'jogar bola', type: 'PLAY',
        effects: { happiness: 25, energy: -20, hunger: -15, satisfaction: 15 }
    },
    {
        id: 'teddy', name: 'pelúcia', icon: '🧸', actionText: 'dar urso de pelúcia', type: 'PLAY',
        effects: { happiness: 30, energy: -5, satisfaction: 25 }
    },
    {
        id: 'box', name: 'caixa', icon: '📦', actionText: 'dar uma caixa de papelão', type: 'PLAY',
        effects: { happiness: 35, satisfaction: 20, energy: -5 }
    },
    // --- ATIVOS ---
    {
        id: 'laser', name: 'laser', icon: '🔦', actionText: 'apontar o laser', type: 'PLAY',
        effects: { happiness: 30, energy: -30, hunger: -15 }
    },
    {
        id: 'bubbles', name: 'bolhas', icon: '🫧', actionText: 'fazer bolhas de sabão', type: 'PLAY',
        effects: { happiness: 20, cleanliness: 5, satisfaction: 15, energy: -5 }
    },
    // --- BAGUNÇA ---
    {
        id: 'mud', name: 'lama', icon: '🐷', actionText: 'pular na lama', type: 'PLAY',
        effects: { happiness: 50, cleanliness: -50, energy: -15, satisfaction: 10 }
    },
    {
        id: 'photo', name: 'foto', icon: '📸', actionText: 'tirar foto', type: 'PHOTO',
        effects: { happiness: 5, satisfaction: 5 }
    },
];
