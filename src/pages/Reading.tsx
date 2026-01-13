import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, BOOKS_LIBRARY, calculateReadingRewards } from '../data/reading/books';

interface ReadingPageProps {
    onReadComplete: (book: Book, rewards: { energy: number; curiosidade: number; persistencia: number; amor: number }) => void;
    petEnergy: number;
}

type ViewState = 'library' | 'reading';

export const ReadingPage: React.FC<ReadingPageProps> = ({ onReadComplete, petEnergy }) => {
    const navigate = useNavigate();
    const [view, setView] = useState<ViewState>('library');
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [isFlipping, setIsFlipping] = useState(false);

    const handleSelectBook = (book: Book) => {
        const rewards = calculateReadingRewards(book);
        if (petEnergy < Math.abs(rewards.energy)) {
            // Not enough energy
            return;
        }
        setSelectedBook(book);
        setCurrentPage(0);
        setView('reading');
    };

    const handleNextPage = () => {
        if (!selectedBook || isFlipping) return;

        setIsFlipping(true);
        setTimeout(() => {
            if (currentPage < selectedBook.pages - 1) {
                setCurrentPage(prev => prev + 1);
            } else {
                // Book finished!
                const rewards = calculateReadingRewards(selectedBook);
                onReadComplete(selectedBook, rewards);
                setView('library');
                setSelectedBook(null);
                setCurrentPage(0);
            }
            setIsFlipping(false);
        }, 300);
    };

    const handlePrevPage = () => {
        if (currentPage > 0 && !isFlipping) {
            setIsFlipping(true);
            setTimeout(() => {
                setCurrentPage(prev => prev - 1);
                setIsFlipping(false);
            }, 300);
        }
    };

    const handleBack = () => {
        if (view === 'reading') {
            setView('library');
            setSelectedBook(null);
            setCurrentPage(0);
        } else {
            navigate('/');
        }
    };

    // Library View
    if (view === 'library') {
        return (
            <div className="min-h-[100dvh] w-full bg-gradient-to-b from-amber-50 to-orange-50 flex flex-col">
                {/* Header */}
                <header className="p-4 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-sm border-b border-amber-100">
                    <button
                        onClick={handleBack}
                        className="bg-white rounded-full p-2.5 shadow-sm text-xl hover:scale-105 transition-transform"
                    >
                        ⬅️
                    </button>
                    <h1 className="text-xl font-black text-cute-text lowercase flex items-center gap-2">
                        📚 biblioteca
                    </h1>
                    <div className="w-10"></div>
                </header>

                {/* Books Grid */}
                <div className="flex-1 overflow-y-auto px-4 py-4">
                    <p className="text-center text-sm text-cute-text/60 mb-4 lowercase">
                        escolha um livro para ler com o bichinho! 📖
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                        {BOOKS_LIBRARY.map(book => {
                            const rewards = calculateReadingRewards(book);
                            const canRead = petEnergy >= Math.abs(rewards.energy);

                            return (
                                <button
                                    key={book.id}
                                    onClick={() => handleSelectBook(book)}
                                    disabled={!canRead}
                                    className={`
                    bg-white rounded-2xl p-3 shadow-sm text-left transition-all
                    ${canRead ? 'hover:scale-[1.02] hover:shadow-md active:scale-95' : 'opacity-50 grayscale'}
                  `}
                                >
                                    {/* Cover */}
                                    <div className="w-full aspect-[3/4] bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center text-4xl mb-2">
                                        {book.cover}
                                    </div>

                                    {/* Info */}
                                    <h3 className="font-bold text-sm text-cute-text lowercase truncate">{book.title}</h3>
                                    <p className="text-[10px] text-cute-text/50 lowercase">{book.author}</p>

                                    {/* Stats */}
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded text-[9px] font-bold">
                                            {book.pages} pág
                                        </span>
                                        <span className="bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded text-[9px] font-bold">
                                            {book.genre}
                                        </span>
                                    </div>

                                    {/* Energy cost */}
                                    <div className="flex items-center gap-1 mt-1.5">
                                        <span className="text-[10px] text-cute-text/40">⚡ -{Math.abs(rewards.energy)}</span>
                                        <span className="text-[10px] text-pink-500">💕 +{rewards.amor}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    // Reading View
    if (!selectedBook) return null;

    const progress = ((currentPage + 1) / selectedBook.pages) * 100;
    const isLastPage = currentPage === selectedBook.pages - 1;

    return (
        <div className="min-h-[100dvh] w-full bg-gradient-to-b from-amber-50 to-orange-50 flex flex-col">
            {/* Header */}
            <header className="p-4 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-sm">
                <button
                    onClick={handleBack}
                    className="bg-white rounded-full p-2.5 shadow-sm text-xl hover:scale-105 transition-transform"
                >
                    ❌
                </button>
                <div className="text-center">
                    <h1 className="text-sm font-bold text-cute-text lowercase truncate max-w-[200px]">{selectedBook.title}</h1>
                    <p className="text-[10px] text-cute-text/50">página {currentPage + 1} de {selectedBook.pages}</p>
                </div>
                <div className="w-10"></div>
            </header>

            {/* Progress Bar */}
            <div className="px-4">
                <div className="h-1.5 bg-amber-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Book Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
                {/* Page */}
                <div
                    className={`
            w-full max-w-sm bg-white rounded-2xl shadow-lg p-6 min-h-[300px]
            flex flex-col justify-center transition-all duration-300
            ${isFlipping ? 'scale-95 opacity-50 rotate-y-3' : 'scale-100 opacity-100'}
          `}
                    style={{
                        background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
                        boxShadow: '0 10px 40px -10px rgba(0,0,0,0.15), inset -5px 0 20px rgba(0,0,0,0.05)'
                    }}
                >
                    {/* Page decoration */}
                    <div className="absolute top-4 right-4 text-2xl opacity-20">{selectedBook.cover}</div>

                    <p className="text-cute-text text-lg leading-relaxed">
                        {selectedBook.content[currentPage]}
                    </p>
                </div>

                {/* Pet reading */}
                <div className="mt-4 flex items-center gap-2">
                    <span className="text-3xl animate-bounce">🥚</span>
                    <span className="text-sm text-cute-text/60 lowercase">lendo junto...</span>
                </div>
            </div>

            {/* Navigation */}
            <div className="p-4 flex items-center justify-between gap-4">
                <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 0 || isFlipping}
                    className="w-14 h-14 bg-white rounded-full shadow-md flex items-center justify-center text-2xl
                     disabled:opacity-30 hover:scale-105 transition-transform active:scale-95"
                >
                    👈
                </button>

                <button
                    onClick={handleNextPage}
                    disabled={isFlipping}
                    className={`
            flex-1 py-4 rounded-2xl font-black text-lg shadow-md lowercase
            transition-all hover:scale-[1.02] active:scale-95
            ${isLastPage
                            ? 'bg-gradient-to-r from-green-500 to-emerald-400 text-white'
                            : 'bg-gradient-to-r from-amber-400 to-orange-400 text-white'
                        }
          `}
                >
                    {isLastPage ? '✨ terminar!' : 'próxima página →'}
                </button>

                <div className="w-14"></div>
            </div>
        </div>
    );
};
