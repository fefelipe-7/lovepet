import React, { useState, useEffect } from 'react';
import { Recipe, CookingAction } from '../types/cooking';
import { INGREDIENTS } from '../data/cooking/ingredients';
import { GameItem } from '../types';
import { RECIPES } from '../data/cooking/recipes';
import { useNavigate } from 'react-router-dom';

interface KitchenPageProps {
    onCookComplete: (food: GameItem) => void;
}

export const KitchenPage: React.FC<KitchenPageProps> = ({ onCookComplete }) => {
    const navigate = useNavigate();
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [timer, setTimer] = useState<number | null>(null);

    // Clean up timer on unmount
    useEffect(() => {
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [timer]);

    // Go back helper
    const handleBack = () => {
        navigate('/');
    };

    // --- LOGIC (Copied from KitchenModal and adapted) ---
    const startRecipe = (recipe: Recipe) => {
        setSelectedRecipe(recipe);
        setCurrentStepIndex(0);
        setProgress(0);
    };

    const completeStep = () => {
        setSelectedRecipe(currentRecipe => {
            if (!currentRecipe) return null;

            setCurrentStepIndex(prevIndex => {
                const nextIndex = prevIndex + 1;
                if (nextIndex >= currentRecipe.steps.length) {
                    // Finish!
                    onCookComplete(currentRecipe.result); // This will handle logic in App
                    navigate('/'); // Return home logic handled by App or here?
                    // If onCookComplete updates state, we might redirect after? 
                    // Let's assume onCookComplete handles logic but WE handle nav
                    return 0;
                }
                setProgress(0);
                return nextIndex;
            });

            return currentRecipe;
        });
    };

    const handleAction = () => {
        if (!selectedRecipe) return;
        const step = selectedRecipe.steps[currentStepIndex];

        if (step.action === CookingAction.COOK || step.action === CookingAction.BAKE) return;

        if (step.targetClicks) {
            const newProgress = progress + 1;
            setProgress(newProgress);
            if (newProgress >= step.targetClicks) {
                completeStep();
            }
        }
    };

    // Auto-progress timer
    useEffect(() => {
        if (!selectedRecipe) return;
        const step = selectedRecipe.steps[currentStepIndex];
        let interval: number | undefined;

        if (step.action === CookingAction.COOK || step.action === CookingAction.BAKE) {
            interval = setInterval(() => {
                setProgress(p => {
                    const increment = (100 / ((step.duration || 5) * 10));
                    const next = p + increment;
                    if (next >= 100) {
                        clearInterval(interval);
                        setTimeout(() => completeStep(), 500);
                        return 100;
                    }
                    return next;
                });
            }, 100) as unknown as number;
            setTimer(interval);
        }
        return () => { if (interval) clearInterval(interval); };
    }, [currentStepIndex, selectedRecipe]);


    // --- RENDER ---
    const renderRecipeSelection = () => (
        <div className="w-full h-full flex flex-col items-center pt-8 px-4 relative">
            <div className="absolute top-4 left-4">
                <button onClick={handleBack} className="bg-white rounded-full p-2 shadow-sm text-2xl">⬅️</button>
            </div>

            <h2 className="text-3xl font-black text-cute-text mb-6 lowercase">receitas</h2>

            <div className="w-full max-w-md grid grid-cols-2 gap-4 overflow-y-auto pb-20 px-2">
                {RECIPES.map(recipe => (
                    <button
                        key={recipe.id}
                        onClick={() => startRecipe(recipe)}
                        className="bg-white rounded-[2rem] p-4 shadow-sm border-2 border-transparent hover:border-cute-pink flex flex-col items-center gap-2 transition-all active:scale-95 group"
                    >
                        <div className="text-5xl group-hover:scale-110 transition-transform">{recipe.icon}</div>
                        <div className="text-center w-full">
                            <p className="font-bold text-cute-text text-sm lowercase leading-tight truncate">{recipe.name}</p>
                            <div className="flex gap-1 justify-center mt-2 flex-wrap">
                                {recipe.ingredients.slice(0, 3).map(ingId => (
                                    <span key={ingId} className="text-xs bg-gray-50 rounded-full w-6 h-6 flex items-center justify-center border border-gray-100">{INGREDIENTS[ingId]?.icon}</span>
                                ))}
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );

    const renderCookingStation = () => {
        if (!selectedRecipe) return null;
        const step = selectedRecipe.steps[currentStepIndex];
        const isTimer = step.action === CookingAction.COOK || step.action === CookingAction.BAKE;
        const displayProgress = isTimer ? progress : Math.min(100, (progress / (step.targetClicks || 1)) * 100);

        return (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 relative">
                <div className="absolute top-4 left-4">
                    <button onClick={() => setSelectedRecipe(null)} className="bg-white rounded-full p-2 shadow-sm text-sm font-bold text-cute-text px-4">cancelar</button>
                </div>

                <h3 className="text-2xl font-black text-cute-text mb-12 animate-bounce lowercase">
                    {step.label}
                </h3>

                <div className="w-64 h-64 bg-white rounded-[3rem] shadow-xl flex items-center justify-center text-[8rem] mb-12 relative overflow-hidden ring-8 ring-white/50">
                    <div
                        className={`z-10 cursor-pointer select-none transition-transform active:scale-95 ${!isTimer ? 'active:rotate-12' : ''}`}
                        onClick={handleAction}
                    >
                        {step.action === CookingAction.MIX ? '🥣' :
                            step.action === CookingAction.CHOP ? '🔪' :
                                step.action === CookingAction.COOK ? '🍳' :
                                    step.action === CookingAction.BLEND ? '🌪️' :
                                        step.action === CookingAction.MASH ? '🥔' : '👐'}
                    </div>
                </div>

                <div className="w-full max-w-xs h-8 bg-black/5 rounded-full overflow-hidden border-4 border-white shadow-sm relative">
                    <div
                        className={`h-full transition-all duration-200 ease-out flex items-center justify-end pr-2
                            ${isTimer ? 'bg-orange-400' : 'bg-cute-green'}
                        `}
                        style={{ width: `${displayProgress}%` }}
                    ></div>
                </div>

                <p className="mt-8 text-cute-text/50 text-base font-bold animate-pulse lowercase">
                    {isTimer ? 'cozinhando...' : step.action === CookingAction.MIX ? 'mexa rapidinho!' : 'toque para fazer!'}
                </p>
            </div>
        );
    };

    return (
        <div className="h-[100dvh] w-full bg-[#FFF5F7] overflow-hidden flex flex-col">
            {!selectedRecipe ? renderRecipeSelection() : renderCookingStation()}
        </div>
    );
};
