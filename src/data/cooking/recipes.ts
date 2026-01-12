import { Recipe, GrowthStage, CookingAction } from '../../types/cooking';
import { GameItem } from '../../types';

// Helper to create simple Feed Items for results
const createResultItem = (id: string, name: string, icon: string, hunger: number, bonusHappiness: number = 0): GameItem => ({
    id: `cooked_${id}`,
    name,
    icon,
    actionText: `dar ${name.toLowerCase()}`,
    type: 'FEED',
    effects: { hunger, happiness: 10 + bonusHappiness, satisfaction: 5 + bonusHappiness }
});

export const RECIPES: Recipe[] = [
    // --- FASE 1: NEWBORN (Recém-Nascido) ---
    {
        id: 'milk_pap', name: 'Papinha de Leite', icon: '🍼', stage: GrowthStage.NEWBORN, difficulty: 1,
        ingredients: ['milk', 'water'],
        steps: [
            { id: 'mix', action: CookingAction.MIX, label: 'Misturar leite e água', targetClicks: 5 }
        ],
        result: createResultItem('milk_pap', 'Papinha de Leite', '🍼', 15)
    },
    {
        id: 'banana_puree', name: 'Purê de Banana', icon: '🍌', stage: GrowthStage.NEWBORN, difficulty: 1,
        ingredients: ['banana', 'milk'],
        steps: [
            { id: 'mash', action: CookingAction.MASH, label: 'Amassar banana', targetClicks: 10 },
            { id: 'mix', action: CookingAction.MIX, label: 'Misturar com leite', targetClicks: 5 }
        ],
        result: createResultItem('banana_puree', 'Purê de Banana', '🥣', 20)
    },
    {
        id: 'apple_sauce', name: 'Papinha de Maçã', icon: '🍎', stage: GrowthStage.NEWBORN, difficulty: 1,
        ingredients: ['apple', 'water'],
        steps: [
            { id: 'mash', action: CookingAction.MASH, label: 'Raspar maçã', targetClicks: 10 },
            { id: 'mix', action: CookingAction.MIX, label: 'Misturar', targetClicks: 5 }
        ],
        result: createResultItem('apple_sauce', 'Papinha de Maçã', '🥣', 18)
    },
    {
        id: 'warm_milk', name: 'Leite Morno', icon: '🥛', stage: GrowthStage.NEWBORN, difficulty: 1,
        ingredients: ['milk'],
        steps: [{ id: 'warm', action: CookingAction.COOK, label: 'Amornar leite', duration: 3 }],
        result: createResultItem('warm_milk', 'Leite Morno', '🥛', 10, 5)
    },
    {
        id: 'simple_porridge', name: 'Mingau Simples', icon: '🍲', stage: GrowthStage.NEWBORN, difficulty: 1,
        ingredients: ['porridge_base', 'milk'],
        steps: [{ id: 'mix', action: CookingAction.MIX, label: 'Misturar tudo', targetClicks: 8 }],
        result: createResultItem('simple_porridge', 'Mingau Simples', '🍲', 25)
    },

    // --- FASE 2: BABY (Bebê) ---
    {
        id: 'chicken_pap', name: 'Papinha de Frango', icon: '🍗', stage: GrowthStage.BABY, difficulty: 2,
        ingredients: ['chicken', 'broth'],
        steps: [
            { id: 'cook', action: CookingAction.COOK, label: 'Cozinhar frango', duration: 5 },
            { id: 'blend', action: CookingAction.BLEND, label: 'Processar', targetClicks: 15 }
        ],
        result: createResultItem('chicken_pap', 'Papinha de Frango', '🥣', 30)
    },
    {
        id: 'potato_puree', name: 'Purê de Batata', icon: '🥔', stage: GrowthStage.BABY, difficulty: 2,
        ingredients: ['potato', 'milk'],
        steps: [
            { id: 'cook', action: CookingAction.COOK, label: 'Cozinhar batata', duration: 5 },
            { id: 'mash', action: CookingAction.MASH, label: 'Amassar bem', targetClicks: 20 },
            { id: 'mix', action: CookingAction.MIX, label: 'Misturar leite', targetClicks: 10 }
        ],
        result: createResultItem('potato_puree', 'Purê de Batata', '🥣', 35)
    },
    {
        id: 'colorful_pap', name: 'Papinha Colorida', icon: '🥕', stage: GrowthStage.BABY, difficulty: 2,
        ingredients: ['carrot', 'pumpkin'],
        steps: [
            { id: 'cook', action: CookingAction.COOK, label: 'Cozinhar legumes', duration: 5 },
            { id: 'mash', action: CookingAction.MASH, label: 'Amassar', targetClicks: 15 }
        ],
        result: createResultItem('colorful_pap', 'Papinha Colorida', '🥣', 25, 5)
    },

    // --- FASE 3: PUPPY (Filhote) ---
    {
        id: 'chicken_rice', name: 'Arroz com Frango', icon: '🍛', stage: GrowthStage.PUPPY, difficulty: 3,
        ingredients: ['rice', 'chicken'],
        steps: [
            { id: 'chop', action: CookingAction.CHOP, label: 'Cortar frango', targetClicks: 15 },
            { id: 'cook', action: CookingAction.COOK, label: 'Cozinhar tudo', duration: 8 },
            { id: 'season', action: CookingAction.SEASON, label: 'Temperar', targetClicks: 5 }
        ],
        result: createResultItem('chicken_rice', 'Arroz com Frango', '🍛', 45)
    },
    {
        id: 'creamy_fish', name: 'Peixinho Cremoso', icon: '🐟', stage: GrowthStage.PUPPY, difficulty: 3,
        ingredients: ['fish', 'milk'],
        steps: [
            { id: 'cook', action: CookingAction.COOK, label: 'Cozinhar peixe', duration: 6 },
            { id: 'mix', action: CookingAction.MIX, label: 'Fazer molho', targetClicks: 15 }
        ],
        result: createResultItem('creamy_fish', 'Peixinho Cremoso', '🐟', 40, 5)
    },

    // --- FASE 4: CHILD (Criança) ---
    {
        id: 'chicken_pasta', name: 'Macarrão com Frango', icon: '🍝', stage: GrowthStage.CHILD, difficulty: 4,
        ingredients: ['pasta', 'chicken', 'cheese'],
        steps: [
            { id: 'cook_pasta', action: CookingAction.COOK, label: 'Cozinhar massa', duration: 8 },
            { id: 'chop_chicken', action: CookingAction.CHOP, label: 'Cortar frango', targetClicks: 20 },
            { id: 'mix_all', action: CookingAction.MIX, label: 'Misturar molho', targetClicks: 15 },
            { id: 'season', action: CookingAction.SEASON, label: 'Finalizar', targetClicks: 5 }
        ],
        result: createResultItem('chicken_pasta', 'Macarrão com Frango', '🍝', 60, 10)
    },

    // --- FASE 5: TEEN (Jovem) ---
    {
        id: 'steak_dinner', name: 'Prato Completo', icon: '🍽️', stage: GrowthStage.TEEN, difficulty: 5,
        ingredients: ['meat', 'rice', 'broccoli', 'herbs'],
        steps: [
            { id: 'chop', action: CookingAction.CHOP, label: 'Preparar carne', targetClicks: 25 },
            { id: 'cook_meat', action: CookingAction.COOK, label: 'Grelhar carne', duration: 10 },
            { id: 'cook_sides', action: CookingAction.COOK, label: 'Cozinhar acompanhamentos', duration: 8 },
            { id: 'season', action: CookingAction.SEASON, label: 'Temperar com ervas', targetClicks: 10 }
        ],
        result: createResultItem('steak_dinner', 'Prato Completo', '🍽️', 80, 20)
    }
];
