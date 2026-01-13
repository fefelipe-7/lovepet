import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, getRandomBooks, calculateReadingRewards } from '../data/reading/books';

interface ReadingPageProps {
    onReadComplete: (book: Book, rewards: { energy: number; curiosidade: number; persistencia: number; amor: number }) => void;
    petEnergy: number;
}

type ViewState = 'library' | 'reading' | 'success';

export const ReadingPage: React.FC<ReadingPageProps> = ({ onReadComplete, petEnergy }) => {
    const navigate = useNavigate();
    const [view, setView] = useState<ViewState>('library');
    const [books, setBooks] = useState<Book[]>([]);
    const [carouselPage, setCarouselPage] = useState(0);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [isFlipping, setIsFlipping] = useState(false);
    const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next');

    const BOOKS_PER_PAGE = 10;

    // Load random books on mount
    useEffect(() => {
        setBooks(getRandomBooks(60));
    }, []);

    const totalCarouselPages = Math.ceil(books.length / BOOKS_PER_PAGE);
    const visibleBooks = books.slice(
        carouselPage * BOOKS_PER_PAGE,
        (carouselPage + 1) * BOOKS_PER_PAGE
    );

    const handleSelectBook = (book: Book) => {
        const rewards = calculateReadingRewards(book);
        if (petEnergy < Math.abs(rewards.energy)) return;
        setSelectedBook(book);
        setCurrentPage(1);
        setView('reading');
    };

    const handleNextPage = () => {
        if (!selectedBook || isFlipping) return;

        setFlipDirection('next');
        setIsFlipping(true);

        setTimeout(() => {
            if (currentPage < selectedBook.pages) {
                setCurrentPage(prev => prev + 1);
            } else {
                const rewards = calculateReadingRewards(selectedBook);
                onReadComplete(selectedBook, rewards);
                setView('success');
            }
            setIsFlipping(false);
        }, 400);
    };

    const handlePrevPage = () => {
        if (currentPage > 1 && !isFlipping) {
            setFlipDirection('prev');
            setIsFlipping(true);
            setTimeout(() => {
                setCurrentPage(prev => prev - 1);
                setIsFlipping(false);
            }, 400);
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

    const handleFinish = () => {
        navigate('/');
    };

    // Success Screen
    if (view === 'success' && selectedBook) {
        const rewards = calculateReadingRewards(selectedBook);
        return (
            <div className="min-h-[100dvh] w-full bg-gradient-to-b from-green-100 to-emerald-50 flex flex-col items-center justify-center p-6">
                <div className="text-6xl mb-4 animate-bounce">📚✨</div>
                <h1 className="text-2xl font-black text-emerald-800 lowercase mb-2">livro finalizado!</h1>
                <p className="text-emerald-600 lowercase mb-6">"{selectedBook.title}"</p>

                <div className="bg-white rounded-2xl p-4 shadow-md mb-6 w-full max-w-sm">
                    <p className="text-sm text-center text-cute-text/60 mb-3 lowercase">recompensas</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-pink-50 p-2 rounded-xl text-center">
                            <span className="text-lg">💕</span>
                            <p className="font-bold text-pink-600">+{rewards.amor}</p>
                            <p className="text-[10px] text-pink-400">amor</p>
                        </div>
                        <div className="bg-purple-50 p-2 rounded-xl text-center">
                            <span className="text-lg">🔍</span>
                            <p className="font-bold text-purple-600">+{rewards.curiosidade}</p>
                            <p className="text-[10px] text-purple-400">curiosidade</p>
                        </div>
                        <div className="bg-blue-50 p-2 rounded-xl text-center">
                            <span className="text-lg">💪</span>
                            <p className="font-bold text-blue-600">+{rewards.persistencia}</p>
                            <p className="text-[10px] text-blue-400">persistência</p>
                        </div>
                        <div className="bg-amber-50 p-2 rounded-xl text-center">
                            <span className="text-lg">⚡</span>
                            <p className="font-bold text-amber-600">{rewards.energy}</p>
                            <p className="text-[10px] text-amber-400">energia</p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleFinish}
                    className="bg-gradient-to-r from-emerald-500 to-green-400 text-white px-8 py-4 rounded-2xl font-black text-lg shadow-lg lowercase hover:scale-105 transition-transform"
                >
                    voltar pra casa 🏠
                </button>
            </div>
        );
    }

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

                <p className="text-center text-sm text-cute-text/60 py-3 lowercase">
                    escolha um livro para ler! 📖
                </p>

                {/* Carousel Navigation */}
                <div className="flex items-center justify-center gap-4 px-4 mb-2">
                    <button
                        onClick={() => setCarouselPage(prev => Math.max(0, prev - 1))}
                        disabled={carouselPage === 0}
                        className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-xl
                       disabled:opacity-30 hover:scale-105 transition-transform"
                    >
                        ◀️
                    </button>
                    <span className="text-sm text-cute-text/60">
                        {carouselPage + 1} / {totalCarouselPages}
                    </span>
                    <button
                        onClick={() => setCarouselPage(prev => Math.min(totalCarouselPages - 1, prev + 1))}
                        disabled={carouselPage >= totalCarouselPages - 1}
                        className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-xl
                       disabled:opacity-30 hover:scale-105 transition-transform"
                    >
                        ▶️
                    </button>
                </div>

                {/* Books Horizontal Scroll */}
                <div className="flex-1 overflow-y-auto px-4 pb-4">
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        {visibleBooks.map(book => {
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
                                    <div className="w-full aspect-[3/4] bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center text-3xl mb-2">
                                        {book.cover}
                                    </div>

                                    <h3 className="font-bold text-xs text-cute-text lowercase truncate">{book.title}</h3>
                                    <p className="text-[9px] text-cute-text/50 truncate">{book.author}</p>

                                    <div className="flex items-center gap-1 mt-1.5">
                                        <span className="bg-amber-100 text-amber-700 px-1 py-0.5 rounded text-[8px] font-bold">
                                            {book.pages}p
                                        </span>
                                        <span className="text-[9px] text-cute-text/40">⚡-{Math.abs(rewards.energy)}</span>
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

    const progress = (currentPage / selectedBook.pages) * 100;

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
                    <h1 className="text-sm font-bold text-cute-text lowercase truncate max-w-[180px]">{selectedBook.title}</h1>
                    <p className="text-[10px] text-cute-text/50">{currentPage} / {selectedBook.pages}</p>
                </div>
                <div className="w-10"></div>
            </header>

            {/* Progress Bar */}
            <div className="px-4">
                <div className="h-2 bg-amber-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Book */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-4">
                <div className="relative w-full max-w-sm perspective-1000">
                    {/* Book page with flip animation */}
                    <div
                        className={`
              w-full aspect-[3/4] bg-[#fffef5] rounded-lg shadow-2xl relative
              transition-transform duration-400 transform-style-preserve-3d
              ${isFlipping && flipDirection === 'next' ? 'animate-flip-right' : ''}
              ${isFlipping && flipDirection === 'prev' ? 'animate-flip-left' : ''}
            `}
                        style={{
                            background: 'linear-gradient(135deg, #fffef5 0%, #f8f5e6 100%)',
                            boxShadow: 'inset -8px 0 30px rgba(0,0,0,0.1), 4px 4px 20px rgba(0,0,0,0.15)'
                        }}
                    >
                        {/* Page texture lines */}
                        <div className="absolute inset-0 opacity-10">
                            {Array.from({ length: 20 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="w-full h-[1px] bg-gray-400"
                                    style={{ marginTop: `${(i + 1) * 5}%` }}
                                />
                            ))}
                        </div>

                        {/* Page number */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                            <span className="text-xs text-amber-700/40 font-serif">{currentPage}</span>
                        </div>

                        {/* Book spine shadow */}
                        <div
                            className="absolute left-0 top-0 bottom-0 w-4 pointer-events-none"
                            style={{
                                background: 'linear-gradient(90deg, rgba(0,0,0,0.15) 0%, transparent 100%)'
                            }}
                        />
                    </div>
                </div>

                {/* Pet reading */}
                <div className="mt-4 flex items-center gap-2">
                    <span className="text-3xl">🥚</span>
                    <span className="text-sm text-cute-text/60 lowercase">lendo junto...</span>
                </div>
            </div>

            {/* Navigation */}
            <div className="p-4 flex items-center gap-4">
                <button
                    onClick={handlePrevPage}
                    disabled={currentPage <= 1 || isFlipping}
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
            ${currentPage >= selectedBook.pages
                            ? 'bg-gradient-to-r from-green-500 to-emerald-400 text-white'
                            : 'bg-gradient-to-r from-amber-400 to-orange-400 text-white'
                        }
          `}
                >
                    {currentPage >= selectedBook.pages ? '✨ terminar!' : 'virar página →'}
                </button>

                <div className="w-14"></div>
            </div>

            {/* CSS for flip animation */}
            <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        @keyframes flipRight {
          0% { transform: rotateY(0deg); }
          50% { transform: rotateY(-15deg); }
          100% { transform: rotateY(0deg); }
        }
        @keyframes flipLeft {
          0% { transform: rotateY(0deg); }
          50% { transform: rotateY(15deg); }
          100% { transform: rotateY(0deg); }
        }
        .animate-flip-right {
          animation: flipRight 0.4s ease-out;
        }
        .animate-flip-left {
          animation: flipLeft 0.4s ease-out;
        }
      `}</style>
        </div>
    );
};
