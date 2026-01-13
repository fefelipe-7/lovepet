import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import HTMLFlipBook from 'react-pageflip';
import { Book, getRandomBooks, calculateReadingRewards } from '../data/reading/books';

interface ReadingPageProps {
    onReadComplete: (book: Book, rewards: { energy: number; curiosidade: number; persistencia: number; amor: number }) => void;
    petEnergy: number;
}

type ViewState = 'library' | 'reading' | 'success';

// Fake text lines generator
const generateFakeLines = (seed: number): string[] => {
    const patterns = [
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '━━━━━━━━━━━━━━━━━━━━━━━',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━',
        '━━━━━━━━━━━━━━━━━━',
        '━━━━━━━━━━━━━━━━━━━━━━━━',
        '━━━━━━━━━━━━━━━',
    ];
    const lines: string[] = [];
    for (let i = 0; i < 12; i++) {
        lines.push(patterns[(seed + i * 3) % patterns.length]);
    }
    return lines;
};

// Random decorations for pages
const getPageDecoration = (pageNum: number): { emoji: string; position: 'top' | 'bottom' | 'corner' } | null => {
    const decorations = ['🌸', '⭐', '🦋', '🌙', '💫', '🌷', '🍀', '🐝', '🌈', '☁️'];
    if (pageNum % 5 === 0) {
        return { emoji: decorations[pageNum % decorations.length], position: 'corner' };
    }
    if (pageNum % 7 === 0) {
        return { emoji: decorations[(pageNum * 3) % decorations.length], position: 'bottom' };
    }
    return null;
};

// Page component for react-pageflip
const Page = forwardRef<HTMLDivElement, { pageNum: number; totalPages: number; bookTitle: string }>(
    ({ pageNum, totalPages, bookTitle }, ref) => {
        const fakeLines = generateFakeLines(pageNum);
        const decoration = getPageDecoration(pageNum);
        const isChapterStart = pageNum === 1 || pageNum % 15 === 0;

        return (
            <div
                ref={ref}
                className="w-full h-full relative overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, #fefcf3 0%, #f9f5e3 50%, #f5f0d8 100%)',
                }}
            >
                {/* Paper texture overlay */}
                <div
                    className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
                    }}
                />

                {/* Page fold shadow */}
                <div
                    className="absolute left-0 top-0 bottom-0 w-6 pointer-events-none"
                    style={{
                        background: 'linear-gradient(90deg, rgba(0,0,0,0.08) 0%, transparent 100%)'
                    }}
                />

                {/* Content area */}
                <div className="relative h-full flex flex-col px-5 py-4">

                    {/* Chapter start decoration */}
                    {isChapterStart && (
                        <div className="flex flex-col items-center mb-4">
                            <div className="text-amber-400/60 text-lg mb-1">✦ ✦ ✦</div>
                            <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-amber-300/40 to-transparent" />
                        </div>
                    )}

                    {/* Fake text content */}
                    <div className="flex-1 flex flex-col gap-2 pt-2">
                        {fakeLines.map((line, idx) => (
                            <div
                                key={idx}
                                className="text-amber-900/20 text-[10px] font-serif tracking-wide"
                                style={{
                                    marginLeft: idx === 0 ? '16px' : '0',
                                    opacity: 0.3 + (idx % 3) * 0.1
                                }}
                            >
                                {line}
                            </div>
                        ))}
                    </div>

                    {/* Corner decoration */}
                    {decoration?.position === 'corner' && (
                        <div className="absolute top-3 right-3 text-lg opacity-30">
                            {decoration.emoji}
                        </div>
                    )}

                    {/* Bottom decoration */}
                    {decoration?.position === 'bottom' && (
                        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-xl opacity-20">
                            {decoration.emoji}
                        </div>
                    )}

                    {/* Page number with decorative line */}
                    <div className="flex items-center justify-center gap-2 mt-auto pt-2">
                        <div className="w-8 h-[1px] bg-amber-300/30" />
                        <span className="text-[10px] text-amber-700/40 font-serif italic">{pageNum}</span>
                        <div className="w-8 h-[1px] bg-amber-300/30" />
                    </div>
                </div>

                {/* Subtle page edge */}
                <div
                    className="absolute right-0 top-0 bottom-0 w-[2px] pointer-events-none"
                    style={{
                        background: 'linear-gradient(180deg, #d4c4a8 0%, #c9b896 50%, #d4c4a8 100%)'
                    }}
                />
            </div>
        );
    }
);

Page.displayName = 'Page';

// Cover component
const BookCover = forwardRef<HTMLDivElement, { book: Book; isBack?: boolean }>(
    ({ book, isBack = false }, ref) => {
        if (isBack) {
            return (
                <div
                    ref={ref}
                    className="w-full h-full flex flex-col items-center justify-center p-4"
                    style={{
                        background: 'linear-gradient(135deg, #7c2d12 0%, #9a3412 50%, #7c2d12 100%)',
                        boxShadow: 'inset 0 0 60px rgba(0,0,0,0.3)'
                    }}
                >
                    <div className="text-4xl mb-4 opacity-60">📖</div>
                    <div className="text-amber-200/40 text-xs lowercase">fim</div>
                </div>
            );
        }

        return (
            <div
                ref={ref}
                className="w-full h-full flex flex-col items-center justify-center p-5"
                style={{
                    background: 'linear-gradient(135deg, #92400e 0%, #b45309 50%, #92400e 100%)',
                    boxShadow: 'inset 0 0 80px rgba(0,0,0,0.3)'
                }}
            >
                {/* Cover decoration top */}
                <div className="flex gap-1 mb-3 opacity-50">
                    <span className="text-amber-300">✦</span>
                    <span className="text-amber-200">✦</span>
                    <span className="text-amber-300">✦</span>
                </div>

                {/* Book icon */}
                <span className="text-5xl mb-4 drop-shadow-lg">{book.cover}</span>

                {/* Title */}
                <h2 className="text-white font-black text-center text-base lowercase leading-tight mb-2 drop-shadow-md">
                    {book.title}
                </h2>

                {/* Decorative line */}
                <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-amber-300/60 to-transparent my-2" />

                {/* Author */}
                <p className="text-amber-200/80 text-[10px] lowercase">{book.author}</p>

                {/* Genre badge */}
                <div className="mt-3 px-2 py-0.5 bg-black/20 rounded-full">
                    <span className="text-[9px] text-amber-100/60 lowercase">{book.genre}</span>
                </div>

                {/* Cover decoration bottom */}
                <div className="flex gap-1 mt-4 opacity-40">
                    <span className="text-amber-300">✧</span>
                    <span className="text-amber-200">✧</span>
                    <span className="text-amber-300">✧</span>
                </div>
            </div>
        );
    }
);

BookCover.displayName = 'BookCover';

export const ReadingPage: React.FC<ReadingPageProps> = ({ onReadComplete, petEnergy }) => {
    const navigate = useNavigate();
    const [view, setView] = useState<ViewState>('library');
    const [books, setBooks] = useState<Book[]>([]);
    const [carouselPage, setCarouselPage] = useState(0);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const flipBookRef = useRef<any>(null);

    const BOOKS_PER_PAGE = 10;

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
        setCurrentPage(0);
        setView('reading');
    };

    const handlePageFlip = (e: any) => {
        setCurrentPage(e.data);
    };

    const handleNextPage = () => {
        if (flipBookRef.current) {
            flipBookRef.current.pageFlip().flipNext();
        }
    };

    const handlePrevPage = () => {
        if (flipBookRef.current) {
            flipBookRef.current.pageFlip().flipPrev();
        }
    };

    const handleFinishBook = () => {
        if (selectedBook) {
            const rewards = calculateReadingRewards(selectedBook);
            onReadComplete(selectedBook, rewards);
            setView('success');
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
                <p className="text-emerald-600 lowercase mb-6 text-center text-sm">"{selectedBook.title}"</p>

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

                <div className="flex items-center justify-center gap-4 px-4 mb-2">
                    <button
                        onClick={() => setCarouselPage(prev => Math.max(0, prev - 1))}
                        disabled={carouselPage === 0}
                        className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-xl disabled:opacity-30 hover:scale-105 transition-transform"
                    >
                        ◀️
                    </button>
                    <span className="text-sm text-cute-text/60">
                        {carouselPage + 1} / {totalCarouselPages}
                    </span>
                    <button
                        onClick={() => setCarouselPage(prev => Math.min(totalCarouselPages - 1, prev + 1))}
                        disabled={carouselPage >= totalCarouselPages - 1}
                        className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-xl disabled:opacity-30 hover:scale-105 transition-transform"
                    >
                        ▶️
                    </button>
                </div>

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
                                    className={`bg-white rounded-2xl p-3 shadow-sm text-left transition-all ${canRead ? 'hover:scale-[1.02] hover:shadow-md active:scale-95' : 'opacity-50 grayscale'}`}
                                >
                                    <div className="w-full aspect-[3/4] bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center text-3xl mb-2">
                                        {book.cover}
                                    </div>
                                    <h3 className="font-bold text-xs text-cute-text lowercase truncate">{book.title}</h3>
                                    <p className="text-[9px] text-cute-text/50 truncate">{book.author}</p>
                                    <div className="flex items-center gap-1 mt-1.5">
                                        <span className="bg-amber-100 text-amber-700 px-1 py-0.5 rounded text-[8px] font-bold">{book.pages}p</span>
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

    const progress = ((currentPage + 2) / selectedBook.pages) * 100;
    const isNearEnd = currentPage >= selectedBook.pages - 2;

    return (
        <div className="min-h-[100dvh] w-full bg-gradient-to-b from-amber-100 to-orange-100 flex flex-col">
            <header className="p-4 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-sm">
                <button
                    onClick={handleBack}
                    className="bg-white rounded-full p-2.5 shadow-sm text-xl hover:scale-105 transition-transform"
                >
                    ❌
                </button>
                <div className="text-center">
                    <h1 className="text-sm font-bold text-cute-text lowercase truncate max-w-[180px]">{selectedBook.title}</h1>
                    <p className="text-[10px] text-cute-text/50">{Math.min(currentPage + 2, selectedBook.pages)} / {selectedBook.pages}</p>
                </div>
                <div className="w-10"></div>
            </header>

            <div className="px-4">
                <div className="h-2 bg-amber-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, progress)}%` }}
                    />
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center px-4 py-4">
                <div className="w-full max-w-md flex justify-center drop-shadow-2xl">
                    <HTMLFlipBook
                        ref={flipBookRef}
                        width={260}
                        height={380}
                        size="stretch"
                        minWidth={180}
                        maxWidth={360}
                        minHeight={280}
                        maxHeight={460}
                        showCover={true}
                        mobileScrollSupport={true}
                        onFlip={handlePageFlip}
                        className=""
                        style={{}}
                        startPage={0}
                        drawShadow={true}
                        flippingTime={800}
                        usePortrait={true}
                        startZIndex={0}
                        autoSize={true}
                        maxShadowOpacity={0.6}
                        showPageCorners={true}
                        disableFlipByClick={false}
                        swipeDistance={30}
                        clickEventForward={true}
                        useMouseEvents={true}
                        renderOnlyPageLengthChange={false}
                    >
                        {/* Front Cover */}
                        <BookCover book={selectedBook} />

                        {/* Pages */}
                        {Array.from({ length: selectedBook.pages }).map((_, i) => (
                            <Page
                                key={i}
                                pageNum={i + 1}
                                totalPages={selectedBook.pages}
                                bookTitle={selectedBook.title}
                            />
                        ))}

                        {/* Back Cover */}
                        <BookCover book={selectedBook} isBack />
                    </HTMLFlipBook>
                </div>

                <div className="mt-4 flex items-center gap-2 bg-white/60 px-4 py-2 rounded-full">
                    <span className="text-2xl">🥚</span>
                    <span className="text-xs text-cute-text/60 lowercase">lendo juntinho... toque para virar</span>
                </div>
            </div>

            <div className="p-4 flex items-center gap-3">
                <button
                    onClick={handlePrevPage}
                    disabled={currentPage <= 0}
                    className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center text-xl disabled:opacity-30 hover:scale-105 transition-transform active:scale-95"
                >
                    👈
                </button>

                {isNearEnd ? (
                    <button
                        onClick={handleFinishBook}
                        className="flex-1 py-3.5 rounded-2xl font-black text-base shadow-md lowercase transition-all hover:scale-[1.02] active:scale-95 bg-gradient-to-r from-green-500 to-emerald-400 text-white"
                    >
                        ✨ terminar leitura!
                    </button>
                ) : (
                    <button
                        onClick={handleNextPage}
                        className="flex-1 py-3.5 rounded-2xl font-black text-base shadow-md lowercase transition-all hover:scale-[1.02] active:scale-95 bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                    >
                        virar página →
                    </button>
                )}

                <button
                    onClick={handleNextPage}
                    className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center text-xl hover:scale-105 transition-transform active:scale-95"
                >
                    👉
                </button>
            </div>
        </div>
    );
};
