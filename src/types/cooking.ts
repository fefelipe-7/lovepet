import { GameItem } from '../types';

export enum GrowthStage {
    NEWBORN = 'NEWBORN',           // Recém-nascido
    BABY = 'BABY',                 // Bebê
    PUPPY = 'PUPPY',               // Filhote
    CHILD = 'CHILD',               // Criança
    TEEN = 'TEEN'                  // Jovem/Adolescente
}

export enum IngredientType {
    BASE = 'BASE',           // Leite, Água, Caldo
    FRUIT = 'FRUIT',         // Banana, Maçã
    VEGETABLE = 'VEGETABLE', // Cenoura, Batata
    PROTEIN = 'PROTEIN',     // Frango, Peixe
    EXTRA = 'EXTRA'          // Mel, Aveia, Temperos
}

export enum CookingAction {
    CHOP = 'CHOP',      // Cortar (cliques)
    MASH = 'MASH',      // Amassar (cliques rápidos)
    MIX = 'MIX',        // Misturar (movimento circular / drag)
    BLEND = 'BLEND',    // Bater no liquidificador (segurar botão)
    COOK = 'COOK',      // Cozinhar/Ferver (barra de tempo)
    BAKE = 'BAKE',      // Assar (barra de tempo)
    SEASON = 'SEASON'   // Temperar (arrastar/clique)
}

export interface Ingredient {
    id: string;
    name: string;
    icon: string;
    type: IngredientType;
}

export interface CookingStep {
    id: string;
    action: CookingAction;
    label: string;
    duration?: number; // Tempo em segundos para COOK/BAKE
    targetClicks?: number; // Cliques necessários para CHOP/MASH
    failureCondition?: 'OVERCOOK' | 'UNDERCOOK' | 'NONE';
}

export interface Recipe {
    id: string;
    name: string;
    icon: string; // Ícone final da comida
    stage: GrowthStage;
    ingredients: string[]; // IDs dos ingredientes
    steps: CookingStep[];
    result: GameItem; // O item final gerado para alimentar
    description?: string;
    difficulty: number; // 1-5
}
