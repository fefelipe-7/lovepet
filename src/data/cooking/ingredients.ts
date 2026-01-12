import { Ingredient, IngredientType } from '../../types/cooking';

export const INGREDIENTS: Record<string, Ingredient> = {
    // --- BASES ---
    'milk': { id: 'milk', name: 'Leite', icon: '🥛', type: IngredientType.BASE },
    'water': { id: 'water', name: 'Água', icon: '💧', type: IngredientType.BASE },
    'broth': { id: 'broth', name: 'Caldo Suave', icon: '🥣', type: IngredientType.BASE },
    'yogurt': { id: 'yogurt', name: 'Iogurte', icon: '🍦', type: IngredientType.BASE },
    'porridge_base': { id: 'porridge_base', name: 'Mingau Base', icon: '🍲', type: IngredientType.BASE },
    'dough': { id: 'dough', name: 'Massa Simples', icon: '🥟', type: IngredientType.BASE },
    'rice': { id: 'rice', name: 'Arroz', icon: '🍚', type: IngredientType.BASE },
    'pasta': { id: 'pasta', name: 'Macarrão', icon: '🍜', type: IngredientType.BASE },

    // --- FRUTAS ---
    'banana': { id: 'banana', name: 'Banana', icon: '🍌', type: IngredientType.FRUIT },
    'apple': { id: 'apple', name: 'Maçã', icon: '🍎', type: IngredientType.FRUIT },
    'pear': { id: 'pear', name: 'Pera', icon: '🍐', type: IngredientType.FRUIT },
    'strawberry': { id: 'strawberry', name: 'Morango', icon: '🍓', type: IngredientType.FRUIT },
    'mango': { id: 'mango', name: 'Manga', icon: '🥭', type: IngredientType.FRUIT },
    'blueberry': { id: 'blueberry', name: 'Mirtilo', icon: '🫐', type: IngredientType.FRUIT },

    // --- VEGETAIS ---
    'carrot': { id: 'carrot', name: 'Cenoura', icon: '🥕', type: IngredientType.VEGETABLE },
    'pumpkin': { id: 'pumpkin', name: 'Abóbora', icon: '🎃', type: IngredientType.VEGETABLE },
    'potato': { id: 'potato', name: 'Batata', icon: '🥔', type: IngredientType.VEGETABLE },
    'peas': { id: 'peas', name: 'Ervilha', icon: '🟢', type: IngredientType.VEGETABLE },
    'broccoli': { id: 'broccoli', name: 'Brócolis', icon: '🥦', type: IngredientType.VEGETABLE },
    'corn': { id: 'corn', name: 'Milho', icon: '🌽', type: IngredientType.VEGETABLE },

    // --- PROTEÍNAS ---
    'chicken': { id: 'chicken', name: 'Frango', icon: '🍗', type: IngredientType.PROTEIN },
    'fish': { id: 'fish', name: 'Peixe', icon: '🐟', type: IngredientType.PROTEIN },
    'egg': { id: 'egg', name: 'Ovo', icon: '🥚', type: IngredientType.PROTEIN },
    'meat': { id: 'meat', name: 'Carne Moída', icon: '🥩', type: IngredientType.PROTEIN },
    'cheese': { id: 'cheese', name: 'Queijo', icon: '🧀', type: IngredientType.PROTEIN },

    // --- EXTRAS ---
    'honey': { id: 'honey', name: 'Mel', icon: '🍯', type: IngredientType.EXTRA },
    'oats': { id: 'oats', name: 'Aveia', icon: '🌾', type: IngredientType.EXTRA },
    'herbs': { id: 'herbs', name: 'Ervas Finas', icon: '🌿', type: IngredientType.EXTRA },
    'spices': { id: 'spices', name: 'Temperinho', icon: '🧂', type: IngredientType.EXTRA },
};
