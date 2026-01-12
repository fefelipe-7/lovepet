
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
  role: UserRole;
  avatar: string;
}

export interface PetState {
  name: string;
  type: string; // e.g., "Gato Galáctico", "Dinossauro Rosa"
  satisfaction: number; // Agora chamado visualmente de "Felicidade" (Nível Geral)
  hunger: number; // 0-100 (100 is full)
  happiness: number; // Agora chamado visualmente de "Amor" (Afeto/Relacionamento)
  energy: number; // 0-100
  cleanliness: number; // 0-100
  mood: Mood;
  age: number; // in days
  growthStage: 'NEWBORN' | 'BABY' | 'PUPPY' | 'CHILD' | 'TEEN'; // Stage derived from age/xp
  xp: number; // Experience points to unlock stages
  image: string | null; // URL of the generated image
  isSleeping: boolean; // Novo estado para o sistema de sono
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
