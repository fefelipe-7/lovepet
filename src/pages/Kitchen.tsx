import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameItem } from '../types';
import { Dish, Ingredient, CookingActionType, COOKING_ACTIONS, EvaluationResult } from '../types/cooking';
import { ALL_INGREDIENTS } from '../data/cooking/ingredients';
import { createDish, addIngredient, applyAction, finishDish } from '../services/cooking/dishService';
import { evaluateDish, getPetReaction } from '../services/cooking/evaluationService';
import { discoverRecipe, getRecipeBook } from '../services/cooking/recipeBookService';

interface KitchenPageProps {
    onCookComplete: (food: GameItem, quality: number) => void;
    petPhase: number; // 1-5
}

export const KitchenPage: React.FC<KitchenPageProps> = ({ onCookComplete, petPhase }) => {
    const navigate = useNavigate();
    const [dish, setDish] = useState<Dish>(createDish());
    const [showResult, setShowResult] = useState(false);
    const [result, setResult] = useState<EvaluationResult | null>(null);
    const [isNewRecipe, setIsNewRecipe] = useState(false);
    const [recipeName, setRecipeName] = useState('');
    const cookTimerRef = useRef<number | null>(null);

    // Cleanup timer
    useEffect(() => {
        return () => {
            if (cookTimerRef.current) clearInterval(cookTimerRef.current);
        };
    }, []);

    const handleBack = () => navigate('/');

    const handleAddIngredient = (ingredient: Ingredient) => {
        if (dish.status !== 'preparing') return;
        if (dish.ingredients.length >= 5) return; // Max 5 ingredients
        setDish(prev => addIngredient(prev, ingredient));
    };

    const handleAction = (action: CookingActionType) => {
        if (dish.status !== 'preparing') return;
        if (dish.ingredients.length === 0) return; // Need ingredients first

        // Special handling for COOK - continuous action
        if (action === 'COOK') {
            setDish(prev => applyAction(prev, action));
            // Could add timer for burning risk here
        } else {
            setDish(prev => applyAction(prev, action));
        }
    };

    const handleServe = () => {
        const finalDish = finishDish(dish);
        setDish(finalDish);

        const evalResult = evaluateDish(finalDish, petPhase);
        setResult(evalResult);

        if (evalResult.accepted && evalResult.quality) {
            const discovered = discoverRecipe(finalDish, petPhase, evalResult.quality);
            if (discovered) {
                setIsNewRecipe(true);
                setRecipeName(discovered.name);
            }
        }

        setShowResult(true);
    };

    const handleFinish = () => {
        if (result?.accepted && result.quality) {
            // Create a GameItem from the dish
            const foodItem: GameItem = {
                id: `cooked_${Date.now()}`,
                name: recipeName || 'Prato Especial',
                icon: '🍽️',
                actionText: `comeu ${recipeName || 'prato especial'}`,
                type: 'FEED',
                effects: {
                    hunger: 10 + (result.quality * 5),
                    happiness: result.quality * 3,
                    satisfaction: result.quality * 2,
                }
            };
            onCookComplete(foodItem, result.quality);
        }
        navigate('/');
    };

    const handleReset = () => {
        setDish(createDish());
        setShowResult(false);
        setResult(null);
        setIsNewRecipe(false);
        setRecipeName('');
    };

    // --- Visual Helpers ---
    const getTextureVisual = () => {
        switch (dish.texture) {
            case 'liquid': return { bg: 'bg-blue-200', animation: 'animate-pulse' };
            case 'creamy': return { bg: 'bg-yellow-100', animation: '' };
            case 'pasty': return { bg: 'bg-orange-200', animation: '' };
            case 'solid': return { bg: 'bg-amber-300', animation: '' };
            case 'strange': return { bg: 'bg-purple-300', animation: 'animate-pulse' };
        }
    };

    const getTemperatureVisual = () => {
        switch (dish.temperature) {
            case 'cold': return { color: 'text-blue-400', icon: '❄️' };
            case 'warm': return { color: 'text-orange-300', icon: '☀️' };
            case 'hot': return { color: 'text-orange-500', icon: '🔥' };
            case 'burning': return { color: 'text-red-600', icon: '💀' };
        }
    };

    const textureVis = getTextureVisual();
    const tempVis = getTemperatureVisual();

    // --- Result Screen ---
    if (showResult && result) {
        return (
            <div className="h-[100dvh] w-full bg-[#FFF5F7] flex flex-col items-center justify-center p-6">
                <div className="text-8xl mb-6 animate-bounce">
                    {result.accepted ? '😋' : '😿'}
                </div>

                <p className="text-2xl font-black text-cute-text mb-4 text-center lowercase">
                    {getPetReaction(result)}
                </p>

                {result.accepted && result.quality && (
                    <div className="flex gap-1 mb-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className={`text-2xl ${i < result.quality! ? '' : 'opacity-30'}`}>⭐</span>
                        ))}
                    </div>
                )}

                {isNewRecipe && (
                    <div className="bg-cute-yellow/30 rounded-2xl px-6 py-3 mb-6 animate-pop">
                        <p className="text-sm font-bold text-cute-text">🎉 Nova receita descoberta!</p>
                        <p className="text-lg font-black text-cute-text">{recipeName}</p>
                    </div>
                )}

                <div className="flex gap-4">
                    <button
                        onClick={handleReset}
                        className="bg-white px-6 py-3 rounded-full font-bold text-cute-text shadow-md"
                    >
                        tentar de novo
                    </button>
                    <button
                        onClick={handleFinish}
                        className="bg-cute-pink px-6 py-3 rounded-full font-bold text-white shadow-md"
                    >
                        voltar
                    </button>
                </div>
            </div>
        );
    }

    // --- Main Cooking UI ---
    return (
        <div className="h-[100dvh] w-full bg-[#FFF5F7] flex flex-col overflow-hidden">

            {/* Header */}
            <header className="p-4 flex items-center justify-between shrink-0">
                <button onClick={handleBack} className="bg-white rounded-full p-2 shadow-sm text-xl">⬅️</button>
                <h1 className="text-xl font-black text-cute-text lowercase">cozinha</h1>
                <div className="w-10"></div>
            </header>

            {/* Station Area - The Bowl/Pan */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 relative">

                {/* Temperature Indicator */}
                <div className={`absolute top-4 right-4 text-3xl ${tempVis.color}`}>
                    {tempVis.icon}
                </div>

                {/* The Bowl */}
                <div className={`
                    w-56 h-56 rounded-[40%] ${textureVis.bg} ${textureVis.animation}
                    shadow-xl border-8 border-white/50 relative overflow-hidden
                    flex flex-wrap items-center justify-center gap-2 p-4
                    ${dish.status === 'burned' ? 'bg-gray-800' : ''}
                `}>
                    {/* Steam if hot */}
                    {(dish.temperature === 'hot' || dish.temperature === 'burning') && (
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex gap-2">
                            <span className="text-2xl animate-float opacity-50">💨</span>
                            <span className="text-xl animate-float delay-500 opacity-30">💨</span>
                        </div>
                    )}

                    {/* Ingredients in bowl */}
                    {dish.ingredients.map((ing, idx) => (
                        <span key={idx} className="text-3xl drop-shadow-sm">{ing.icon}</span>
                    ))}

                    {dish.ingredients.length === 0 && (
                        <span className="text-cute-text/30 font-bold text-sm lowercase">adicione ingredientes</span>
                    )}
                </div>

                {/* Status Pills */}
                <div className="flex gap-2 mt-4">
                    <span className="bg-white/80 px-3 py-1 rounded-full text-xs font-bold text-cute-text/70 lowercase">
                        {dish.homogeneity === 'low' ? 'separado' : dish.homogeneity === 'medium' ? 'misturado' : 'uniforme'}
                    </span>
                    <span className="bg-white/80 px-3 py-1 rounded-full text-xs font-bold text-cute-text/70 lowercase">
                        complexidade: {dish.complexity}
                    </span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="px-4 pb-2 shrink-0">
                <div className="flex justify-center gap-3 mb-4">
                    {COOKING_ACTIONS.map(action => (
                        <button
                            key={action.type}
                            onClick={() => handleAction(action.type)}
                            disabled={dish.status !== 'preparing' || dish.ingredients.length === 0}
                            className="w-14 h-14 bg-white rounded-2xl shadow-sm flex flex-col items-center justify-center gap-0.5 active:scale-95 transition-transform disabled:opacity-50"
                        >
                            <span className="text-2xl">{action.icon}</span>
                            <span className="text-[8px] font-bold text-cute-text/60 lowercase">{action.label}</span>
                        </button>
                    ))}
                </div>

                {/* Serve Button */}
                <button
                    onClick={handleServe}
                    disabled={dish.ingredients.length === 0 || dish.status !== 'preparing'}
                    className="w-full bg-cute-green text-white py-4 rounded-2xl font-black text-lg shadow-md lowercase disabled:opacity-50 active:scale-98 transition-transform mb-2"
                >
                    🍽️ servir
                </button>
            </div>

            {/* Pantry - Ingredient Grid */}
            <div className="bg-white/90 rounded-t-[2rem] pt-4 pb-6 px-4 shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                <p className="text-center text-xs font-bold text-cute-text/50 mb-3 lowercase">despensa</p>
                <div className="grid grid-cols-6 gap-2 max-h-32 overflow-y-auto">
                    {ALL_INGREDIENTS.map(ingredient => (
                        <button
                            key={ingredient.id}
                            onClick={() => handleAddIngredient(ingredient)}
                            disabled={dish.status !== 'preparing' || dish.ingredients.length >= 5}
                            className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-2xl active:scale-90 transition-transform disabled:opacity-30 hover:bg-white border border-transparent hover:border-cute-pink/30"
                            title={ingredient.name}
                        >
                            {ingredient.icon}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
