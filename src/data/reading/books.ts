// ===== READING SYSTEM - BOOK CATALOG =====
// 200 books with varying page counts (10-499)

export interface Book {
    id: string;
    title: string;
    author: string;
    genre: string;
    pages: number;
    cover: string;
}

// Genres and themes
const GENRES = ['Fantasia', 'Aventura', 'Romance', 'Mistério', 'Comédia', 'Drama', 'Terror', 'Ficção', 'Poesia', 'Fábula'];
const COVERS = ['📕', '📗', '📘', '📙', '📓', '📔', '📒', '📚', '📖', '🔖'];

// Name components for procedural generation
const TITLE_STARTS = [
    'A Nuvem', 'O Segredo de', 'Aventuras de', 'O Mistério de', 'A Jornada de',
    'Mel e', 'Fefe e', 'Nana e', 'Histórias de', 'O Último',
    'A Primeira', 'O Grande', 'A Pequena', 'Contos de', 'Lendas de',
    'O Livro de', 'A Magia de', 'O Sonho de', 'A Estrela de', 'O Jardim de',
    'A Casa de', 'O Reino de', 'A Floresta de', 'O Mar de', 'A Montanha de',
    'O Tesouro de', 'A Coragem de', 'O Amor de', 'A Amizade de', 'O Poder de'
];

const TITLE_ENDS = [
    'Mel', 'Nana', 'Fefe', 'Nuvem', 'Bichinho', 'Pelúcia', 'Estrelas',
    'Sonhos', 'Arco-Íris', 'Chocolate', 'Flores', 'Borboletas', 'Corações',
    'Aventura', 'Magia', 'Carinho', 'Abraços', 'Beijos', 'Alegria', 'Paz',
    'Esperança', 'Coragem', 'Amizade', 'Família', 'Lar', 'Céu', 'Sol', 'Lua',
    'Aurora', 'Crepúsculo', 'Primavera', 'Verão', 'Outono', 'Inverno'
];

const AUTHORS = [
    'Mel Docinho', 'Nana Escritora', 'Fefe Sonhador', 'Nuvem Peluda',
    'Bichinho Autor', 'Flor de Mel', 'Estrela Nana', 'Coração Fefe',
    'Sol Nascente', 'Lua Cheia', 'Aurora Brilhante', 'Céu Azul',
    'Jardim Florido', 'Mar Calmo', 'Montanha Alta', 'Rio Sereno',
    'Borboleta Encantada', 'Passarinho Feliz', 'Coelho Saltitante', 'Urso Gentil'
];

// Generate a single book
function generateBook(id: number): Book {
    const titleStart = TITLE_STARTS[id % TITLE_STARTS.length];
    const titleEnd = TITLE_ENDS[(id * 7) % TITLE_ENDS.length];
    const author = AUTHORS[(id * 3) % AUTHORS.length];
    const genre = GENRES[(id * 5) % GENRES.length];
    const cover = COVERS[(id * 11) % COVERS.length];

    // Pages: weighted distribution from 10 to 499
    // More short/medium books, fewer very long ones
    let pages: number;
    const rand = (id * 17) % 100;
    if (rand < 30) {
        pages = 10 + (id % 40); // 10-49 pages (30%)
    } else if (rand < 60) {
        pages = 50 + (id % 100); // 50-149 pages (30%)
    } else if (rand < 85) {
        pages = 150 + (id % 150); // 150-299 pages (25%)
    } else {
        pages = 300 + (id % 200); // 300-499 pages (15%)
    }

    return {
        id: `book_${id}`,
        title: `${titleStart} ${titleEnd}`,
        author,
        genre,
        pages,
        cover
    };
}

// Generate 200 books
export const BOOKS_CATALOG: Book[] = Array.from({ length: 200 }, (_, i) => generateBook(i + 1));

// Shuffle array using seed
function shuffleWithSeed(array: Book[], seed: number): Book[] {
    const result = [...array];
    let m = result.length;
    let s = seed;

    while (m) {
        s = (s * 9301 + 49297) % 233280;
        const i = Math.floor((s / 233280) * m--);
        [result[m], result[i]] = [result[i], result[m]];
    }

    return result;
}

// Get random selection of books for this session
export function getRandomBooks(count: number = 50): Book[] {
    const seed = Math.floor(Date.now() / 60000); // Changes every minute
    const shuffled = shuffleWithSeed(BOOKS_CATALOG, seed);
    return shuffled.slice(0, count);
}

// Calculate rewards based on book pages
export function calculateReadingRewards(book: Book): {
    energy: number;
    curiosidade: number;
    persistencia: number;
    amor: number;
} {
    // Scale rewards based on page count
    const pageScale = Math.log10(book.pages) / Math.log10(500); // 0-1 scale

    const curiosidade = Math.floor(3 + pageScale * 7); // 3-10
    const persistencia = Math.floor(2 + pageScale * 8); // 2-10
    const amor = Math.floor(8 - pageScale * 5); // 8-3 (shorter = more love)
    const energyLoss = Math.floor(5 + pageScale * 20); // 5-25

    return {
        energy: -energyLoss,
        curiosidade,
        persistencia,
        amor
    };
}
