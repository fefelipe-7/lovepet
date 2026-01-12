import React, { useState, useEffect } from 'react';
import { Recipe, CookingStep, CookingAction } from '../../types/cooking';
import { INGREDIENTS } from '../../data/cooking/ingredients';
import { GameItem } from '../../types';

interface KitchenModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCookComplete: (food: GameItem) => void;
    recipes: Recipe[];
}

export const KitchenModal: React.FC<KitchenModalProps> = ({ isOpen, onClose, onCookComplete, recipes }) => {
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [timer, setTimer] = useState<number | null>(null); // Use existing timer logic or replace with useRef for betterReact practices later

    // Reset when opening/closing
    useEffect(() => {
        if (!isOpen) {
            setSelectedRecipe(null);
            setCurrentStepIndex(0);
            setProgress(0);
            if (timer) clearInterval(timer);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // --- LOGIC ---

    // Auto-progress for timed actions (Simulated stove)
    useEffect(() => {
        if (!selectedRecipe) return;
        const step = selectedRecipe.steps[currentStepIndex];

        let interval: number | undefined;

        if (step.action === CookingAction.COOK || step.action === CookingAction.BAKE) {
            // Start timer
            interval = setInterval(() => {
                setProgress(p => {
                    // Increment 10% per 100ms * (10 / duration) approx logic
                    const increment = (100 / ((step.duration || 5) * 10));
                    const next = p + increment;
                    if (next >= 100) {
                        clearInterval(interval);
                        // Small delay before step completion
                        setTimeout(() => completeStep(), 500);
                        return 100;
                    }
                    return next;
                });
            }, 100) as unknown as number;
            setTimer(interval);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [currentStepIndex, selectedRecipe]);

    const completeStep = () => {
        // Need to read fresh state if called from timeout?
        // Actually in functional component this closure might be stale if checking selectedRecipe immediately 
        // BUT selectedRecipe doesn't change during steps.

        setSelectedRecipe(currentRecipe => {
            if (!currentRecipe) return null;

            setCurrentStepIndex(prevIndex => {
                const nextIndex = prevIndex + 1;
                if (nextIndex >= currentRecipe.steps.length) {
                    // Finish!
                    onCookComplete(currentRecipe.result);
                    onClose();
                    return 0; // Reset
                }
                setProgress(0); // Reset for next step
                return nextIndex;
            });

            return currentRecipe;
        });
    };

    const handleAction = () => {
        if (!selectedRecipe) return;
        const step = selectedRecipe.steps[currentStepIndex];

        // Block manual clicks on Timer steps
        if (step.action === CookingAction.COOK || step.action === CookingAction.BAKE) {
            return;
        }

        // Click based actions (CHOP, MIX, MASH)
        if (step.targetClicks) {
            const newProgress = progress + 1;
            setProgress(newProgress);

            // Visual feedback could go here

            if (newProgress >= step.targetClicks) {
                completeStep();
            }
        }
    };

    // --- RENDER HELPERS ---

    const renderRecipeSelection = () => (
        <div className="w-full h-full flex flex-col p-4">
            <h2 className="text-2xl font-bold text-cute-text mb-4 text-center lowercase">🍳 cozinha</h2>
            <div className="grid grid-cols-2 gap-3 overflow-y-auto pb-20 scrollbar-hide">
                {recipes.map(recipe => (
                    <button
                        key={recipe.id}
                        onClick={() => setSelectedRecipe(recipe)}
                        className="bg-white rounded-2xl p-3 shadow-sm border-2 border-transparent hover:border-cute-pink flex flex-col items-center gap-2 transition-all active:scale-95"
                    >
                        <div className="text-4xl">{recipe.icon}</div>
                        <div className="text-center">
                            <p className="font-bold text-cute-text text-sm lowercase leading-tight">{recipe.name}</p>
                            <div className="flex gap-1 justify-center mt-1 flex-wrap">
                                {recipe.ingredients.slice(0, 3).map(ingId => (
                                    <span key={ingId} className="text-xs bg-gray-50 rounded p-0.5">{INGREDIENTS[ingId]?.icon}</span>
                                ))}
                            </div>
                        </div>
                    </button>
                ))}
            </div>
            <button onClick={onClose} className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white text-cute-text px-6 py-2 rounded-full font-bold shadow-md hover:scale-105 transition-transform">
                voltar
            </button>
        </div>
    );

    const renderCookingStation = () => {
        if (!selectedRecipe) return null;
        const step = selectedRecipe.steps[currentStepIndex];
        const isTimer = step.action === CookingAction.COOK || step.action === CookingAction.BAKE;

        // Calculate progress %
        // For click steps: (clicks / target) * 100
        const displayProgress = isTimer ? progress : Math.min(100, (progress / (step.targetClicks || 1)) * 100);

        return (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-[#FFF5F7]">
                <h3 className="text-xl font-bold text-cute-text mb-8 animate-bounce lowercase">
                    {step.label}
                </h3>

                <div className="w-48 h-48 bg-white rounded-full shadow-lg flex items-center justify-center text-8xl mb-8 relative overflow-hidden ring-4 ring-white">
                    {/* Interactive Area */}
                    <div
                        className={`z-10 cursor-pointer select-none transition-transform
                            ${!isTimer ? 'active:scale-90 active:rotate-12' : ''}
                        `}
                        onClick={handleAction}
                    >
                        {step.action === CookingAction.MIX ? '🥣' :
                            step.action === CookingAction.CHOP ? '🔪' :
                                step.action === CookingAction.COOK ? '🍳' :
                                    step.action === CookingAction.BLEND ? '🌪️' :
                                        step.action === CookingAction.MASH ? '🥔' : '👐'}
                    </div>

                    {/* Background decor */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-pink-50/50 pointer-events-none"></div>
                </div>

                {/* Progress Bar */}
                <div className="w-64 h-6 bg-gray-100 rounded-full overflow-hidden border-4 border-white shadow-sm relative">
                    {/* Striped patterns for flair */}
                    <div
                        className={`h-full transition-all duration-200 ease-out flex items-center justify-end pr-2
                            ${isTimer ? 'bg-orange-300' : 'bg-cute-green'}
                        `}
                        style={{ width: `${displayProgress}%` }}
                    >
                        {displayProgress > 10 && <span className="text-[8px] text-white font-bold">✨</span>}
                    </div>
                </div>

                {!isTimer && (
                    <p className="mt-4 text-cute-text/50 text-sm font-bold animate-pulse lowercase">
                        {step.action === CookingAction.MIX ? 'mexa rapidinho!' : 'clique para fazer!'}
                    </p>
                )}
                {isTimer && (
                    <p className="mt-4 text-orange-400 text-sm font-bold lowercase">
                        cozinhando... cheirinho bom!
                    </p>
                )}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center animate-fade-in">
            <div className="w-full sm:w-[400px] h-[90vh] sm:h-[600px] bg-[#FFF5F7] rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl overflow-hidden relative">
                {!selectedRecipe ? renderRecipeSelection() : renderCookingStation()}
            </div>
        </div>
    );
};
