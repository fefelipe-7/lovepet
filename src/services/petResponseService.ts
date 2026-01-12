import { PetState, User, ChatMessage, Mood } from '../types';

interface PetResponse {
    text: string;
    newMood: Mood;
}

const RESPONSES: Record<string, string[]> = {
    'hungry': [
        'nwn... fome...',
        'minha barriguinha tá roncando...',
        'queru papá...',
        'tem comida ai? 🥺'
    ],
    'happy': [
        'yey! te amo! ❤️',
        'que dia lindo!',
        'brincar! brincar!',
        'tô muito feliz! ✨'
    ],
    'sad': [
        'sniff...',
        'queria um carinho...',
        'tô tristinho hoje...',
        'ninguém brinca comigo...'
    ],
    'sleepy': [
        'zzz... soninho...',
        'posso dormir um pouquinho?',
        'bocejo...',
        'cama quentinha...'
    ],
    'dirty': [
        'cof cof... poeira...',
        'preciso de banho...',
        'tô sujinho...',
        'eca... queria ficar limpinho...'
    ],
    'generic': [
        'oii!',
        'arf arf!',
        'te amo humana(o)!',
        'vc é o melhor!',
        'tô aqui!',
        'vamos passear?'
    ]
};

const getRandomResponse = (category: string): string => {
    const list = RESPONSES[category] || RESPONSES['generic'];
    return list[Math.floor(Math.random() * list.length)];
};

export const getPetResponse = (
    pet: PetState,
    action: string
): PetResponse => {
    let responseText = "";
    let newMood = pet.mood;

    // React to low stats
    if (pet.hunger < 30) {
        responseText = getRandomResponse('hungry');
        newMood = Mood.SAD;
    } else if (pet.energy < 20) {
        responseText = getRandomResponse('sleepy');
        newMood = Mood.SLEEPY;
    } else if (pet.cleanliness < 30) {
        responseText = getRandomResponse('dirty');
        newMood = Mood.SAD;
    } else if (pet.happiness > 70) {
        responseText = getRandomResponse('happy');
        newMood = Mood.HAPPY;
    } else {
        responseText = getRandomResponse('generic');
    }

    // Contextual overrides based on action keywords
    const lowerAction = action.toLowerCase();

    if (lowerAction.includes('comer') || lowerAction.includes('dar')) {
        if (pet.hunger > 90) {
            responseText = "tô cheio! *burp*";
        } else {
            responseText = "nham nham! delicia! 😋";
            newMood = Mood.HAPPY;
        }
    }

    if (lowerAction.includes('banho') || lowerAction.includes('limpar')) {
        responseText = "agora tô cheirosinho! ✨";
        newMood = Mood.HAPPY;
    }

    if (lowerAction.includes('jogar') || lowerAction.includes('brincar')) {
        responseText = "uhul! isso é muito divertido! 🎾";
        newMood = Mood.EXCITED;
    }

    if (lowerAction.includes('luz') || lowerAction.includes('dormir')) {
        responseText = "boa noite... zzz... 😴";
        newMood = Mood.SLEEPY;
    }

    return {
        text: responseText,
        newMood
    };
};
