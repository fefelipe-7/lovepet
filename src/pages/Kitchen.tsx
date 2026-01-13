import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameItem } from '../types';
import { Dish, Ingredient, CookingActionType, COOKING_ACTIONS, EvaluationResult } from '../types/cooking';
import { ALL_INGREDIENTS } from '../data/cooking/ingredients';
import { createDish, addIngredient, applyAction, finishDish, getDishSignature } from '../services/cooking/dishService';
import { evaluateDish, getPetReaction } from '../services/cooking/evaluationService';
import { discoverRecipe, getRecipeBook } from '../services/cooking/recipeBookService';
import { addToInventory } from '../services/cooking/inventoryService';

// Assets
import cenarioCozinha from '../assets/images/cenarios/cenario-cozinha.png';
import panelaRn from '../assets/images/panelas/panela-rn.png';

interface KitchenPageProps {
    onCookComplete: (food: GameItem, quality: number) => void;
    petPhase: number;
}

export const KitchenPage: React.FC<KitchenPageProps> = ({ onCookComplete, petPhase }) => {
    const navigate = useNavigate();
    const [dish, setDish] = useState<Dish>(createDish());
    const [showResult, setShowResult] = useState(false);
    const [result, setResult] = useState<EvaluationResult | null>(null);
    const [isNewRecipe, setIsNewRecipe] = useState(false);
    const [recipeName, setRecipeName] = useState('');

    // Animation states
    const [lastAction, setLastAction] = useState<CookingActionType | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);

    const handleBack = () => navigate('/');

    const handleAddIngredient = (ingredient: Ingredient) => {
        if (dish.status !== 'preparing') return;
        if (dish.ingredients.length >= 5) return;
        setDish(prev => addIngredient(prev, ingredient));
    };

    const handleAction = (action: CookingActionType) => {
        if (dish.status !== 'preparing') return;
        if (dish.ingredients.length === 0) return;

        // Trigger animation
        setLastAction(action);
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 500);

        setDish(prev => applyAction(prev, action));
    };

    const handleDiscard = () => {
        setDish(createDish());
        setShowResult(false);
        setResult(null);
        setIsNewRecipe(false);
        setRecipeName('');
    };

    const handleServe = () => {
        const finalDish = finishDish(dish);
        setDish(finalDish);

        const evalResult = evaluateDish(finalDish, petPhase);
        setResult(evalResult);

        if (evalResult.accepted && evalResult.quality) {
            const discovered = discoverRecipe(finalDish, petPhase, evalResult.quality);
            const name = discovered?.name || getExistingRecipeName(finalDish);
            setRecipeName(name);

            if (discovered) {
                setIsNewRecipe(true);
                // Add to inventory
                addToInventory(discovered, evalResult.quality);
            } else {
                // Already known recipe - still add to inventory
                const existingRecipe = {
                    id: getDishSignature(finalDish),
                    name: name,
                    ingredientIds: finalDish.ingredients.map(i => i.id),
                    actions: finalDish.actionHistory,
                    discoveredAtPhase: petPhase,
                    quality: evalResult.quality,
                    discoveredAt: Date.now()
                };
                addToInventory(existingRecipe, evalResult.quality);
            }
        }

        setShowResult(true);
    };

    const getExistingRecipeName = (finalDish: Dish): string => {
        const sig = getDishSignature(finalDish);
        const book = getRecipeBook();
        const existing = book.find(r => r.id === sig);
        return existing?.name || 'Prato Especial';
    };

    const handleFinish = () => {
        // Don't feed immediately - food goes to inventory
        navigate('/');
    };

    // --- Visual Helpers ---
    const getTextureVisual = () => {
        switch (dish.texture) {
            case 'liquid': return { bg: 'bg-blue-200', animation: '' };
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

    // Get ingredient visual classes based on last action
    const getIngredientAnimation = () => {
        if (!isAnimating || !lastAction) return '';
        switch (lastAction) {
            case 'MIX': return 'animate-spin';
            case 'BEAT': return 'animate-bounce';
            case 'COOK': return 'animate-pulse scale-110';
            case 'COOL': return 'opacity-70 scale-90';
            case 'SEASON': return 'animate-wiggle';
            default: return '';
        }
    };

    const textureVis = getTextureVisual();
    const tempVis = getTemperatureVisual();
    const ingredientAnim = getIngredientAnimation();

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
                    <>
                        <div className="flex gap-1 mb-4">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <span key={i} className={`text-2xl ${i < result.quality! ? '' : 'opacity-30'}`}>⭐</span>
                            ))}
                        </div>
                        <p className="text-sm text-cute-text/60 mb-4 lowercase">
                            +1 {recipeName} no inventário!
                        </p>
                    </>
                )}

                {isNewRecipe && (
                    <div className="bg-cute-yellow/30 rounded-2xl px-6 py-3 mb-6 animate-pop">
                        <p className="text-sm font-bold text-cute-text">🎉 Nova receita descoberta!</p>
                        <p className="text-lg font-black text-cute-text">{recipeName}</p>
                    </div>
                )}

                <div className="flex gap-4">
                    <button
                        onClick={handleDiscard}
                        className="bg-white px-6 py-3 rounded-full font-bold text-cute-text shadow-md"
                    >
                        cozinhar mais
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
        <div className="h-[100dvh] w-full flex flex-col overflow-hidden relative">
            {/* Background with overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${cenarioCozinha})` }}
            />
            <div className="absolute inset-0 bg-black/30" />

            {/* Header */}
            <header className="relative z-10 p-4 flex items-center justify-between shrink-0">
                <button onClick={handleBack} className="bg-white/90 backdrop-blur-sm rounded-full p-2.5 shadow-lg text-xl hover:scale-105 transition-transform">⬅️</button>
                <h1 className="text-xl font-black text-white lowercase drop-shadow-md">cozinha</h1>
                <button
                    onClick={handleDiscard}
                    disabled={dish.ingredients.length === 0}
                    className="bg-white/90 backdrop-blur-sm rounded-full p-2.5 shadow-lg text-xl disabled:opacity-30 hover:scale-105 transition-transform"
                    title="Jogar fora"
                >
                    🗑️
                </button>
            </header>

            {/* Station Area */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4">

                {/* Temperature Indicator */}
                <div className={`absolute top-4 right-4 text-3xl ${tempVis.color}`}>
                    {tempVis.icon}
                </div>

                {/* Status Badge */}
                {dish.status === 'burned' && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                        🔥 queimado!
                    </div>
                )}

                {/* The Pan */}
                <div className={`
                    relative w-64 h-64 flex items-center justify-center
                    transition-all duration-300
                    ${isAnimating && lastAction === 'MIX' ? 'rotate-12' : ''}
                    ${isAnimating && lastAction === 'BEAT' ? 'scale-95' : ''}
                `}>
                    {/* Pan Image */}
                    <img
                        src={panelaRn}
                        alt="Panela"
                        className={`
                            w-full h-full object-contain drop-shadow-2xl
                            ${dish.status === 'burned' ? 'brightness-50' : ''}
                        `}
                    />

                    {/* Steam if hot */}
                    {(dish.temperature === 'hot' || dish.temperature === 'burning') && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex gap-2">
                            <span className="text-3xl animate-float opacity-60">💨</span>
                            <span className="text-2xl animate-float delay-300 opacity-40">💨</span>
                            <span className="text-xl animate-float delay-500 opacity-30">💨</span>
                        </div>
                    )}

                    {/* Ingredients inside pan */}
                    <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-1 p-12">
                        {dish.ingredients.map((ing, idx) => (
                            <span
                                key={idx}
                                className={`text-2xl drop-shadow-lg transition-all duration-300 ${ingredientAnim}`}
                                style={{ animationDelay: `${idx * 50}ms` }}
                            >
                                {dish.status === 'burned' ? '🔥' : ing.icon}
                            </span>
                        ))}

                        {dish.ingredients.length === 0 && (
                            <span className="text-white/50 font-bold text-xs lowercase text-center drop-shadow-md">adicione ingredientes</span>
                        )}
                    </div>
                </div>

                {/* Status Pills */}
                <div className="flex gap-2 mt-4">
                    <span className={`
                        px-3 py-1 rounded-full text-xs font-bold lowercase transition-all
                        ${dish.homogeneity === 'high' ? 'bg-green-100 text-green-700' : 'bg-white/80 text-cute-text/70'}
                    `}>
                        {dish.homogeneity === 'low' ? 'separado' : dish.homogeneity === 'medium' ? 'misturado' : '✓ uniforme'}
                    </span>
                    <span className="bg-white/80 px-3 py-1 rounded-full text-xs font-bold text-cute-text/70 lowercase">
                        complexidade: {dish.complexity}
                    </span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="relative z-10 px-4 pb-2 shrink-0">
                <div className="flex justify-center gap-2 mb-3">
                    {COOKING_ACTIONS.map(action => (
                        <button
                            key={action.type}
                            onClick={() => handleAction(action.type)}
                            disabled={dish.status !== 'preparing' || dish.ingredients.length === 0}
                            className={`
                                w-12 h-12 sm:w-14 sm:h-14 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg 
                                flex flex-col items-center justify-center gap-0.5 
                                transition-all duration-200 disabled:opacity-40
                                hover:scale-105 hover:bg-white
                                ${lastAction === action.type && isAnimating ? 'scale-110 ring-2 ring-cute-pink bg-cute-pink/20' : 'active:scale-95'}
                            `}
                        >
                            <span className="text-xl sm:text-2xl">{action.icon}</span>
                            <span className="text-[7px] sm:text-[8px] font-bold text-cute-text/60 lowercase">{action.label}</span>
                        </button>
                    ))}
                </div>

                {/* Serve Button */}
                <button
                    onClick={handleServe}
                    disabled={dish.ingredients.length === 0 || dish.status !== 'preparing'}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-400 text-white py-3.5 rounded-2xl font-black text-lg shadow-lg lowercase disabled:opacity-40 disabled:grayscale active:scale-[0.98] transition-all hover:shadow-xl"
                >
                    🍽️ servir
                </button>
            </div>

            {/* Pantry */}
            <div className="relative z-10 bg-gradient-to-t from-white via-white/95 to-white/80 rounded-t-[2rem] pt-4 pb-6 px-3 shrink-0 shadow-[0_-8px_30px_rgba(0,0,0,0.15)] backdrop-blur-sm">
                <div className="flex items-center justify-center gap-2 mb-3">
                    <span className="text-lg">🧺</span>
                    <p className="text-sm font-bold text-cute-text/70 lowercase">despensa</p>
                    <span className="text-xs text-cute-text/40">({dish.ingredients.length}/5)</span>
                </div>

                <div className="grid grid-cols-5 sm:grid-cols-7 gap-2 max-h-36 overflow-y-auto pb-2 scrollbar-hide">
                    {ALL_INGREDIENTS.map((ingredient, idx) => (
                        <button
                            key={ingredient.id}
                            onClick={() => handleAddIngredient(ingredient)}
                            disabled={dish.status !== 'preparing' || dish.ingredients.length >= 5}
                            className={`
                                aspect-square bg-white rounded-2xl flex flex-col items-center justify-center gap-0.5
                                shadow-sm border-2 border-transparent
                                transition-all duration-200 active:scale-90
                                disabled:opacity-30 disabled:grayscale
                                hover:border-cute-pink/40 hover:shadow-md hover:scale-105
                                ${dish.ingredients.some(i => i.id === ingredient.id) ? 'ring-2 ring-cute-pink/50 bg-cute-pink/10' : ''}
                            `}
                            title={ingredient.name}
                            style={{ animationDelay: `${idx * 30}ms` }}
                        >
                            <span className="text-2xl">{ingredient.icon}</span>
                            <span className="text-[8px] font-semibold text-cute-text/50 truncate w-full text-center px-1 lowercase">{ingredient.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
