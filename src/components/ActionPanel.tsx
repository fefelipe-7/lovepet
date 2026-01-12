import React, { useState } from 'react';
import { UserRole, GameItem } from '../types';
import { FOOD_ITEMS } from '../data/items/foodItems';
import { CLEAN_ITEMS } from '../data/items/cleanItems';
import { PLAY_ITEMS } from '../data/items/playItems';
import { SLEEP_ITEMS } from '../data/items/sleepItems';

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
    switch (activeTab) {
      case 'FOOD': return FOOD_ITEMS;
      case 'CLEAN': return CLEAN_ITEMS;
      case 'PLAY': return PLAY_ITEMS;
      case 'SLEEP': return SLEEP_ITEMS;
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