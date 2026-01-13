
export enum Mood {
  HAPPY = 'HAPPY',
  SAD = 'SAD',
  ANGRY = 'ANGRY',
  SLEEPY = 'SLEEPY',
  EXCITED = 'EXCITED',
  NEUTRAL = 'NEUTRAL'
}

export enum UserRole {
  USER_A = 'USER_A',
  USER_B = 'USER_B'
}

export interface User {
  name: string;
  avatar: string;
}

export interface PetState {
  name: string;
  satisfaction: number;
  hunger: number;
  happiness: number;
  energy: number;
  cleanliness: number;
  mood: Mood;
  age: number;
  growthStage: 'NEWBORN' | 'BABY' | 'PUPPY' | 'CHILD' | 'TEEN';
  xp: number;
  image: string | null;
  isSleeping: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'pet' | UserRole;
  text: string;
  timestamp: number;
  isAction?: boolean; // If true, displayed differently (e.g., "*User A alimentou o pet*")
}

// Novos tipos para o sistema complexo de itens
export interface ItemEffects {
  hunger?: number;      // Quanto alimenta (positivo) ou gasta fome (negativo)
  energy?: number;      // Quanto recupera energia ou cansa
  cleanliness?: number; // Quanto limpa
  happiness?: number;   // Quanto dá de Amor/Afeto
  satisfaction?: number;// Impacto na Felicidade Geral (Bônus extra)
}

export interface GameItem {
  id: string;
  name: string;
  icon: string;
  actionText: string;
  type: 'FEED' | 'PLAY' | 'SLEEP' | 'CLEAN' | 'PHOTO';
  effects: ItemEffects;
  minigame?: 'RPS'; // Pedra Papel Tesoura
}
