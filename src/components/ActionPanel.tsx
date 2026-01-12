import React, { useState } from 'react';
import { UserRole, GameItem } from '../types';

interface ActionPanelProps {
  onInteract: (item: GameItem) => void;
  disabled: boolean;
  currentUserRole: UserRole;
  isSleeping: boolean;
  onWakeUp: () => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

type Category = 'FOOD' | 'CLEAN' | 'PLAY' | 'SLEEP';

interface InteractionButtonProps {
    item: GameItem;
    onClick: () => void;
    disabled: boolean;
}

// Sub-component to handle individual button animation state
const InteractionButton: React.FC<InteractionButtonProps> = ({ 
    item, 
    onClick, 
    disabled 
}) => {
    const [isPressed, setIsPressed] = useState(false);

    const handleClick = () => {
        if (disabled) return;
        setIsPressed(true);
        onClick();
        
        // Reset animation state after delay
        setTimeout(() => setIsPressed(false), 300);
    };

    return (
        <button
            onClick={handleClick}
            disabled={disabled}
            className={`
            group bg-white rounded-xl p-2 flex flex-col items-center justify-center gap-1.5
            shadow-sm border-2 transition-all duration-200 overflow-hidden relative
            ${isPressed 
                ? 'scale-95 border-cute-pink bg-cute-pink/10 shadow-inner' 
                : 'border-transparent hover:border-cute-pink/30 hover:shadow-md active:scale-95'
            }
            disabled:opacity-50 disabled:grayscale
            `}
        >
            <div className={`
                w-10 h-10 flex items-center justify-center text-3xl transition-transform rounded-full
                ${isPressed ? 'scale-90' : 'group-hover:scale-110 bg-gray-50'}
            `}>
                {item.icon}
            </div>
            <span className="text-[10px] font-bold text-cute-text/70 leading-tight text-center w-full truncate px-1 lowercase">{item.name}</span>
        </button>
    );
};

// --- SISTEMAS INDEPENDENTES ---

const FOOD_SYSTEM: GameItem[] = [
    // 1-10: Proteínas Básicas
    { id: 'meat', name: 'carne', icon: '🍖', actionText: 'dar carne suculenta', type: 'FEED', effects: { hunger: 40, energy: 10 } },
    { id: 'chicken_leg', name: 'frango', icon: '🍗', actionText: 'dar coxa de frango', type: 'FEED', effects: { hunger: 35, energy: 8 } },
    { id: 'steak', name: 'bife', icon: '🥩', actionText: 'dar um bife nobre', type: 'FEED', effects: { hunger: 45, happiness: 10 } },
    { id: 'bacon', name: 'bacon', icon: '🥓', actionText: 'dar bacon crocante', type: 'FEED', effects: { hunger: 20, happiness: 15, cleanliness: -5 } },
    { id: 'egg', name: 'ovo', icon: '🍳', actionText: 'dar um ovo frito', type: 'FEED', effects: { hunger: 15, energy: 10 } },
    { id: 'sausage', name: 'salsicha', icon: '🌭', actionText: 'dar uma salsicha', type: 'FEED', effects: { hunger: 25 } },
    { id: 'ham', name: 'presunto', icon: '🍖', actionText: 'dar presunto', type: 'FEED', effects: { hunger: 20 } },
    { id: 'kebab', name: 'espetinho', icon: '🍢', actionText: 'dar um espetinho', type: 'FEED', effects: { hunger: 30, happiness: 5 } },
    { id: 'tofu', name: 'tofu', icon: '🧊', actionText: 'dar cubos de tofu', type: 'FEED', effects: { hunger: 15, cleanliness: 2 } },
    { id: 'beans', name: 'feijão', icon: '🫘', actionText: 'dar feijãozinho', type: 'FEED', effects: { hunger: 25, energy: 5 } },

    // 11-20: Frutos do Mar (Favoritos da Foca)
    { id: 'fish', name: 'peixe', icon: '🐟', actionText: 'dar peixe fresco', type: 'FEED', effects: { hunger: 35, happiness: 20, satisfaction: 25 } },
    { id: 'shrimp', name: 'camarão', icon: '🍤', actionText: 'dar camarão', type: 'FEED', effects: { hunger: 15, happiness: 30 } },
    { id: 'sushi', name: 'sushi', icon: '🍣', actionText: 'dar sushi', type: 'FEED', effects: { hunger: 25, happiness: 25, satisfaction: 30 } },
    { id: 'lobster', name: 'lagosta', icon: '🦞', actionText: 'dar lagosta chique', type: 'FEED', effects: { hunger: 40, happiness: 40 } },
    { id: 'crab', name: 'caranguejo', icon: '🦀', actionText: 'dar caranguejo', type: 'FEED', effects: { hunger: 30, happiness: 15 } },
    { id: 'squid', name: 'lula', icon: '🦑', actionText: 'dar lula', type: 'FEED', effects: { hunger: 25, happiness: 10 } },
    { id: 'oyster', name: 'ostra', icon: '🦪', actionText: 'dar uma ostra', type: 'FEED', effects: { hunger: 10, happiness: 20 } },
    { id: 'sashimi', name: 'sashimi', icon: '🍥', actionText: 'dar sashimi', type: 'FEED', effects: { hunger: 20, happiness: 25 } },
    { id: 'prawn_fry', name: 'tempurá', icon: '🍤', actionText: 'dar tempurá', type: 'FEED', effects: { hunger: 30, cleanliness: -5 } },
    { id: 'canned', name: 'atum', icon: '🥫', actionText: 'dar atum em lata', type: 'FEED', effects: { hunger: 35 } },

    // 21-35: Frutas
    { id: 'apple', name: 'maçã', icon: '🍎', actionText: 'dar maçã vermelha', type: 'FEED', effects: { hunger: 15, cleanliness: 5 } },
    { id: 'green_apple', name: 'maçã verde', icon: '🍏', actionText: 'dar maçã verde', type: 'FEED', effects: { hunger: 15, cleanliness: 5 } },
    { id: 'pear', name: 'pêra', icon: '🍐', actionText: 'dar uma pêra', type: 'FEED', effects: { hunger: 15 } },
    { id: 'orange', name: 'laranja', icon: '🍊', actionText: 'dar laranja', type: 'FEED', effects: { hunger: 15, happiness: 5 } },
    { id: 'lemon', name: 'limão', icon: '🍋', actionText: 'dar limão azedo', type: 'FEED', effects: { hunger: 5, happiness: -5, energy: 10 } },
    { id: 'banana', name: 'banana', icon: '🍌', actionText: 'dar banana', type: 'FEED', effects: { hunger: 20, energy: 15 } },
    { id: 'watermelon', name: 'melancia', icon: '🍉', actionText: 'dar melancia', type: 'FEED', effects: { hunger: 25, cleanliness: 5 } },
    { id: 'grapes', name: 'uvas', icon: '🍇', actionText: 'dar uvas', type: 'FEED', effects: { hunger: 10, happiness: 5 } },
    { id: 'strawberry', name: 'morango', icon: '🍓', actionText: 'dar morango', type: 'FEED', effects: { hunger: 10, happiness: 15 } },
    { id: 'blueberry', name: 'mirtilo', icon: '🫐', actionText: 'dar mirtilos', type: 'FEED', effects: { hunger: 5, happiness: 10 } },
    { id: 'melon', name: 'melão', icon: '🍈', actionText: 'dar melão', type: 'FEED', effects: { hunger: 20 } },
    { id: 'cherry', name: 'cereja', icon: '🍒', actionText: 'dar cerejas', type: 'FEED', effects: { hunger: 5, happiness: 10 } },
    { id: 'peach', name: 'pêssego', icon: '🍑', actionText: 'dar pêssego', type: 'FEED', effects: { hunger: 15 } },
    { id: 'mango', name: 'manga', icon: '🥭', actionText: 'dar manga', type: 'FEED', effects: { hunger: 20, happiness: 10 } },
    { id: 'pineapple', name: 'abacaxi', icon: '🍍', actionText: 'dar abacaxi', type: 'FEED', effects: { hunger: 20 } },

    // 36-45: Legumes e Vegetais
    { id: 'carrot', name: 'cenoura', icon: '🥕', actionText: 'dar cenoura', type: 'FEED', effects: { hunger: 15, cleanliness: 2 } },
    { id: 'corn', name: 'milho', icon: '🌽', actionText: 'dar espiga de milho', type: 'FEED', effects: { hunger: 25 } },
    { id: 'broccoli', name: 'brócolis', icon: '🥦', actionText: 'dar brócolis', type: 'FEED', effects: { hunger: 20, happiness: -5 } },
    { id: 'cucumber', name: 'pepino', icon: '🥒', actionText: 'dar pepino', type: 'FEED', effects: { hunger: 10, cleanliness: 5 } },
    { id: 'lettuce', name: 'alface', icon: '🥬', actionText: 'dar folha de alface', type: 'FEED', effects: { hunger: 5 } },
    { id: 'tomato', name: 'tomate', icon: '🍅', actionText: 'dar tomate', type: 'FEED', effects: { hunger: 10 } },
    { id: 'eggplant', name: 'berinjela', icon: '🍆', actionText: 'dar berinjela', type: 'FEED', effects: { hunger: 15 } },
    { id: 'avocado', name: 'abacate', icon: '🥑', actionText: 'dar abacate', type: 'FEED', effects: { hunger: 25, happiness: 5 } },
    { id: 'potato', name: 'batata', icon: '🥔', actionText: 'dar batata crua', type: 'FEED', effects: { hunger: 20 } },
    { id: 'pepper', name: 'pimenta', icon: '🌶️', actionText: 'dar pimenta picante', type: 'FEED', effects: { hunger: 5, energy: 20, happiness: -10 } },
    
    // 46-55: Carboidratos e Padaria
    { id: 'bread', name: 'pão', icon: '🍞', actionText: 'dar fatia de pão', type: 'FEED', effects: { hunger: 20 } },
    { id: 'croissant', name: 'croissant', icon: '🥐', actionText: 'dar croissant', type: 'FEED', effects: { hunger: 25, happiness: 10 } },
    { id: 'baguette', name: 'baguete', icon: '🥖', actionText: 'dar baguete', type: 'FEED', effects: { hunger: 30 } },
    { id: 'pretzel', name: 'pretzel', icon: '🥨', actionText: 'dar pretzel', type: 'FEED', effects: { hunger: 20 } },
    { id: 'bagel', name: 'bagel', icon: '🥯', actionText: 'dar bagel', type: 'FEED', effects: { hunger: 25 } },
    { id: 'pancakes', name: 'panquecas', icon: '🥞', actionText: 'dar pilha de panquecas', type: 'FEED', effects: { hunger: 40, happiness: 15 } },
    { id: 'waffle', name: 'waffle', icon: '🧇', actionText: 'dar waffle', type: 'FEED', effects: { hunger: 35, happiness: 10 } },
    { id: 'cheese', name: 'queijo', icon: '🧀', actionText: 'dar queijo', type: 'FEED', effects: { hunger: 20, happiness: 5 } },
    { id: 'rice', name: 'arroz', icon: '🍚', actionText: 'dar tigela de arroz', type: 'FEED', effects: { hunger: 25 } },
    { id: 'noodles', name: 'miojo', icon: '🍜', actionText: 'dar macarrão', type: 'FEED', effects: { hunger: 35 } },

    // 56-65: Junk Food
    { id: 'burger', name: 'burguer', icon: '🍔', actionText: 'dar hamburguer', type: 'FEED', effects: { hunger: 50, energy: -10, cleanliness: -5 } },
    { id: 'fries', name: 'fritas', icon: '🍟', actionText: 'dar batata frita', type: 'FEED', effects: { hunger: 30, energy: -5, cleanliness: -5 } },
    { id: 'pizza', name: 'pizza', icon: '🍕', actionText: 'dar fatia de pizza', type: 'FEED', effects: { hunger: 45, cleanliness: -5 } },
    { id: 'hotdog', name: 'hot dog', icon: '🌭', actionText: 'dar cachorro quente', type: 'FEED', effects: { hunger: 40, cleanliness: -5 } },
    { id: 'sandwich', name: 'sanduíche', icon: '🥪', actionText: 'dar sanduíche', type: 'FEED', effects: { hunger: 35 } },
    { id: 'taco', name: 'taco', icon: '🌮', actionText: 'dar taco', type: 'FEED', effects: { hunger: 30, happiness: 5 } },
    { id: 'burrito', name: 'burrito', icon: '🌯', actionText: 'dar burrito', type: 'FEED', effects: { hunger: 45, energy: -5 } },
    { id: 'popcorn', name: 'pipoca', icon: '🍿', actionText: 'dar pipoca', type: 'FEED', effects: { hunger: 10, happiness: 10 } },
    { id: 'nachos', name: 'nachos', icon: '🥙', actionText: 'dar nachos', type: 'FEED', effects: { hunger: 25, cleanliness: -5 } },
    { id: 'chips', name: 'batata', icon: '🥔', actionText: 'dar salgadinho', type: 'FEED', effects: { hunger: 15, cleanliness: -5 } },

    // 66-80: Doces e Sobremesas
    { id: 'icecream', name: 'sorvete', icon: '🍦', actionText: 'dar sorvete', type: 'FEED', effects: { hunger: 10, happiness: 20, cleanliness: -5 } },
    { id: 'donut', name: 'donut', icon: '🍩', actionText: 'dar donut', type: 'FEED', effects: { hunger: 20, happiness: 15, energy: 5 } },
    { id: 'cookie', name: 'cookie', icon: '🍪', actionText: 'dar cookie', type: 'FEED', effects: { hunger: 10, happiness: 10 } },
    { id: 'cake', name: 'bolo', icon: '🍰', actionText: 'dar fatia de bolo', type: 'FEED', effects: { hunger: 25, happiness: 25 } },
    { id: 'chocolate', name: 'chocolate', icon: '🍫', actionText: 'dar barra de chocolate', type: 'FEED', effects: { hunger: 10, happiness: 15, energy: 10 } },
    { id: 'candy', name: 'bala', icon: '🍬', actionText: 'dar uma bala', type: 'FEED', effects: { hunger: 2, happiness: 5, energy: 5 } },
    { id: 'lollipop', name: 'pirulito', icon: '🍭', actionText: 'dar pirulito', type: 'FEED', effects: { hunger: 2, happiness: 8 } },
    { id: 'custard', name: 'pudim', icon: '🍮', actionText: 'dar pudim', type: 'FEED', effects: { hunger: 15, happiness: 20 } },
    { id: 'honey', name: 'mel', icon: '🍯', actionText: 'dar pote de mel', type: 'FEED', effects: { hunger: 10, happiness: 15, cleanliness: -5 } },
    { id: 'cupcake', name: 'cupcake', icon: '🧁', actionText: 'dar cupcake', type: 'FEED', effects: { hunger: 15, happiness: 15 } },
    { id: 'pie', name: 'torta', icon: '🥧', actionText: 'dar torta', type: 'FEED', effects: { hunger: 30, happiness: 15 } },
    { id: 'dango', name: 'dango', icon: '🍡', actionText: 'dar dango doce', type: 'FEED', effects: { hunger: 15, happiness: 10 } },
    { id: 'shaved_ice', name: 'raspadinha', icon: '🍧', actionText: 'dar raspadinha', type: 'FEED', effects: { hunger: 5, happiness: 15 } },
    { id: 'mooncake', name: 'mooncake', icon: '🥮', actionText: 'dar bolinho da lua', type: 'FEED', effects: { hunger: 20, happiness: 10 } },
    { id: 'birthday', name: 'bolo niver', icon: '🎂', actionText: 'dar bolo de aniversário', type: 'FEED', effects: { hunger: 50, happiness: 50, satisfaction: 50 } },

    // 81-90: Bebidas
    { id: 'milk', name: 'leite', icon: '🥛', actionText: 'dar copo de leite', type: 'FEED', effects: { hunger: 10, energy: 5 } },
    { id: 'coffee', name: 'café', icon: '☕', actionText: 'dar golinho de café', type: 'FEED', effects: { energy: 30, happiness: -5 } },
    { id: 'tea', name: 'chá', icon: '🍵', actionText: 'dar chá verde', type: 'FEED', effects: { happiness: 5, cleanliness: 2 } },
    { id: 'juice', name: 'suco', icon: '🧃', actionText: 'dar suco de caixinha', type: 'FEED', effects: { hunger: 5, happiness: 5 } },
    { id: 'soda', name: 'refri', icon: '🥤', actionText: 'dar refrigerante', type: 'FEED', effects: { energy: 10, happiness: 10, hunger: 2 } },
    { id: 'boba', name: 'boba tea', icon: '🧋', actionText: 'dar chá de bolhas', type: 'FEED', effects: { hunger: 10, happiness: 20 } },
    { id: 'beer', name: 'cerveja', icon: '🍺', actionText: 'dar... cerveja?!', type: 'FEED', effects: { happiness: 10, energy: -10, cleanliness: -5 } },
    { id: 'cocktail', name: 'drink', icon: '🍹', actionText: 'dar drink tropical', type: 'FEED', effects: { happiness: 15, energy: -5 } },
    { id: 'wine', name: 'vinho', icon: '🍷', actionText: 'dar taça de vinho', type: 'FEED', effects: { happiness: 10, energy: -5 } },
    { id: 'mate', name: 'mate', icon: '🧉', actionText: 'dar chimarrão', type: 'FEED', effects: { energy: 10, happiness: 5 } },

    // 91-99: Pratos Internacionais e Extras
    { id: 'spaghetti', name: 'espaguete', icon: '🍝', actionText: 'dar macarronada', type: 'FEED', effects: { hunger: 40, cleanliness: -10 } },
    { id: 'curry', name: 'curry', icon: '🍛', actionText: 'dar arroz com curry', type: 'FEED', effects: { hunger: 45, energy: 5 } },
    { id: 'paella', name: 'paella', icon: '🥘', actionText: 'dar paella', type: 'FEED', effects: { hunger: 50, happiness: 15 } },
    { id: 'dumpling', name: 'guioza', icon: '🥟', actionText: 'dar guioza', type: 'FEED', effects: { hunger: 15, happiness: 10 } },
    { id: 'bento', name: 'bento', icon: '🍱', actionText: 'dar marmita japonesa', type: 'FEED', effects: { hunger: 40, happiness: 15 } },
    { id: 'soup', name: 'sopa', icon: '🍲', actionText: 'dar sopa quente', type: 'FEED', effects: { hunger: 25, happiness: 10 } },
    { id: 'salad', name: 'salada', icon: '🥗', actionText: 'dar salada', type: 'FEED', effects: { hunger: 20, cleanliness: 5 } },
    { id: 'falafel', name: 'falafel', icon: '🧆', actionText: 'dar falafel', type: 'FEED', effects: { hunger: 25 } },
    { id: 'coconut', name: 'coco', icon: '🥥', actionText: 'dar água de coco', type: 'FEED', effects: { hunger: 10, happiness: 15 } },
];

const CLEAN_SYSTEM: GameItem[] = [
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

const PLAY_SYSTEM: GameItem[] = [
      // --- MINIGAMES ---
      {
        id: 'rps', name: 'jokenpô', icon: '✊✋✌️', actionText: 'jogar pedra, papel e tesoura', type: 'PLAY',
        effects: { happiness: 0, energy: -10 }, // Effects handled dynamically by game result
        minigame: 'RPS'
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

const SLEEP_SYSTEM: GameItem[] = [
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

export const ActionPanel: React.FC<ActionPanelProps> = ({ 
    onInteract, 
    disabled, 
    currentUserRole, 
    isSleeping, 
    onWakeUp,
    isExpanded,
    onToggleExpand
}) => {
  const [activeTab, setActiveTab] = useState<Category>('FOOD');

  // If sleeping, show wake up panel
  if (isSleeping) {
      return (
        <div className="w-full h-40 bg-indigo-950 rounded-t-[2rem] flex flex-col items-center justify-center relative shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.5)] border-t-4 border-indigo-900 z-50">
             <div className="absolute top-0 w-20 h-1 bg-white/10 rounded-full mt-3"></div>
             <p className="text-indigo-200 mb-4 font-bold animate-pulse text-sm lowercase">zzz... shhh... (recuperando energia)</p>
             <button 
                onClick={onWakeUp}
                className="bg-yellow-400 hover:bg-yellow-300 text-yellow-900 px-8 py-3 rounded-full font-black shadow-lg shadow-yellow-400/20 transform hover:scale-105 transition-all flex items-center gap-2 lowercase"
             >
                <span>☀️</span> acordar
             </button>
        </div>
      );
  }

  const tabs: { id: Category; icon: string; label: string; color: string }[] = [
    { id: 'FOOD', icon: '🥣', label: 'comer', color: 'bg-[#FFDAC1]' },
    { id: 'CLEAN', icon: '🚿', label: 'banho', color: 'bg-[#B5EAD7]' },
    { id: 'PLAY', icon: '🎾', label: 'brincar', color: 'bg-[#C7CEEA]' },
    { id: 'SLEEP', icon: '🛌', label: 'dormir', color: 'bg-[#E2F0CB]' },
  ];

  const getCurrentList = () => {
      switch(activeTab) {
          case 'FOOD': return FOOD_SYSTEM;
          case 'CLEAN': return CLEAN_SYSTEM;
          case 'PLAY': return PLAY_SYSTEM;
          case 'SLEEP': return SLEEP_SYSTEM;
          default: return [];
      }
  };

  const handleTabClick = (tabId: Category) => {
    if (activeTab === tabId) {
        onToggleExpand();
    } else {
        setActiveTab(tabId);
        if (!isExpanded) onToggleExpand();
    }
  };

  return (
    <div className={`
        w-full flex flex-col bg-white rounded-t-[2rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] 
        border-t-4 border-white transition-all duration-500 ease-in-out
        ${isExpanded ? 'h-[55vh]' : 'h-24'} 
    `}>
      
      {/* Handle Bar (Toggle Button) */}
      <div 
        onClick={onToggleExpand}
        className="w-full h-6 shrink-0 flex items-center justify-center cursor-pointer hover:bg-gray-50 rounded-t-[2rem] active:bg-gray-100 touch-pan-y group"
      >
        <div className={`
            w-10 h-1.5 rounded-full transition-colors duration-300
            ${isExpanded ? 'bg-cute-pink/40 group-hover:bg-cute-pink' : 'bg-gray-200 group-hover:bg-gray-300'}
        `}></div>
      </div>

      {/* TABS */}
      <div className="flex w-full overflow-x-auto scrollbar-hide px-1 gap-1 bg-white shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`
              flex-1 py-2 rounded-t-xl flex flex-col items-center justify-center gap-0.5 transition-all relative
              ${activeTab === tab.id ? 'bg-[#FFF5F7] text-cute-text font-bold -mb-2 pb-3 z-10' : 'bg-white text-cute-text/40 hover:bg-gray-50'}
            `}
          >
            <span className={`text-xl ${activeTab === tab.id ? 'animate-pop' : ''}`}>{tab.icon}</span>
            {activeTab !== tab.id && <span className="text-[9px] font-bold tracking-wide lowercase">{tab.label}</span>}
            
            {/* Active Indicator / Toggle Hint */}
            {activeTab === tab.id && (
               <div className={`absolute top-0 w-6 h-1 rounded-full ${tab.color} ${!isExpanded ? 'animate-pulse' : ''}`}></div>
            )}
          </button>
        ))}
      </div>

      {/* GRID CONTENT area (Collapsible) */}
      <div className={`
         bg-[#FFF5F7] flex-1 overflow-y-auto scrollbar-hide p-3 pb-6 transition-opacity duration-300
         ${isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}>
        <div className="grid grid-cols-3 gap-2 pb-8">
          {getCurrentList().map((item) => (
            <InteractionButton
                key={item.id}
                item={item}
                disabled={disabled}
                onClick={() => onInteract(item)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};