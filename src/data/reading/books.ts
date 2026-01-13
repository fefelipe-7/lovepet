// ===== READING SYSTEM TYPES =====

export interface Book {
    id: string;
    title: string;
    author: string;
    genre: string;
    pages: number;
    cover: string; // emoji
    description: string;
    content: string[]; // Each page's content
}

export interface ReadingProgress {
    bookId: string;
    currentPage: number;
    completed: boolean;
    completedAt?: number;
}

// Books library - themed with mel, nana, fefe, nuvem
export const BOOKS_LIBRARY: Book[] = [
    {
        id: 'book_1',
        title: 'A Nuvem que Sonhava',
        author: 'Mel Docinho',
        genre: 'Fantasia',
        pages: 5,
        cover: '☁️',
        description: 'Uma nuvem pequenininha que queria ser diferente.',
        content: [
            'Era uma vez uma nuvem chamada Floquinho que morava no céu azul...',
            'Floquinho sonhava em ser colorida, não só branca como as outras nuvens.',
            'Um dia, ela conheceu o arco-íris e pediu emprestado suas cores.',
            'O arco-íris riu gentil e disse: "As cores estão no seu coração!"',
            'Floquinho percebeu que já era especial do jeito que era. Fim! 💕'
        ]
    },
    {
        id: 'book_2',
        title: 'Aventuras de Fefe e Nana',
        author: 'Nuvem Peluda',
        genre: 'Aventura',
        pages: 8,
        cover: '🌟',
        description: 'Dois amigos em uma jornada mágica.',
        content: [
            'Fefe e Nana eram os melhores amigos de todo o reino.',
            'Um dia, descobriram um mapa antigo no sótão da vovó.',
            'O mapa levava a uma floresta encantada cheia de bichinhos.',
            'Na floresta, conheceram um coelhinho perdido chamado Mel.',
            'Juntos, ajudaram Mel a encontrar sua toca.',
            'A toca ficava embaixo de um grande carvalho mágico.',
            'Como agradecimento, Mel deu a eles uma semente especial.',
            'Plantaram a semente e nasceu uma árvore de abraços! Fim! 🌳'
        ]
    },
    {
        id: 'book_3',
        title: 'O Segredo do Mel',
        author: 'Fefe Sonhador',
        genre: 'Mistério',
        pages: 10,
        cover: '🍯',
        description: 'Um mistério doce para resolver.',
        content: [
            'Na vila dos bichinhos, o mel começou a sumir misteriosamente.',
            'A detetive Nana foi chamada para investigar o caso.',
            'Ela encontrou pegadas douradas perto da colmeia.',
            'As pegadas levavam até a casa do urso Fofinho.',
            'Mas espera... Fofinho estava dormindo há três dias!',
            'As pegadas continuavam até o rio cristalino.',
            'Lá, Nana encontrou um grupo de abelhinhas fazendo festa!',
            'Elas não estavam roubando, estavam fazendo mel extra!',
            'Era uma surpresa para o aniversário da rainha abelha.',
            'Nana guardou o segredo e ganhou um pote especial. Fim! 🐝'
        ]
    },
    {
        id: 'book_4',
        title: 'Nana e a Estrela Cadente',
        author: 'Mel Brilhante',
        genre: 'Fantasia',
        pages: 6,
        cover: '⭐',
        description: 'Uma noite mágica de desejos.',
        content: [
            'Nana adorava olhar as estrelas antes de dormir.',
            'Uma noite, viu uma estrela caindo bem no jardim!',
            'Correu para ver e encontrou uma estrelinha assustada.',
            'A estrelinha disse: "Me perdi do céu, como volto?"',
            'Nana teve uma ideia: "Vou te lançar do balanço!"',
            'Com um empurrão mágico, a estrela voltou brilhando. Fim! ✨'
        ]
    },
    {
        id: 'book_5',
        title: 'A Receita da Vovó Nuvem',
        author: 'Nana Cozinheira',
        genre: 'Culinária',
        pages: 7,
        cover: '🧁',
        description: 'Aprendendo a cozinhar com amor.',
        content: [
            'Vovó Nuvem tinha as melhores receitas do mundo.',
            'Seu segredo? Uma pitada de carinho em cada prato!',
            'Fefe queria aprender a fazer o bolo de nuvem.',
            'Primeiro, você pega ovos brancos como nuvens...',
            'Depois, bate com açúcar até ficar fofinho!',
            'Leva ao forno e espera com paciência.',
            'O resultado? O bolo mais gostoso de todos! Fim! 🎂'
        ]
    },
    {
        id: 'book_6',
        title: 'Bichinhos em Festa',
        author: 'Coletivo Peludo',
        genre: 'Comédia',
        pages: 4,
        cover: '🎉',
        description: 'Uma festa muito animada!',
        content: [
            'Era o aniversário do bichinho e todos foram convidados!',
            'Fefe levou bolo, Nana levou balões coloridos.',
            'Mel trouxe música e Nuvem trouxe abraços.',
            'Foi a melhor festa de todas! Fim! 🎈'
        ]
    },
    {
        id: 'book_7',
        title: 'O Jardim dos Sentimentos',
        author: 'Fefe Jardineiro',
        genre: 'Reflexão',
        pages: 9,
        cover: '🌻',
        description: 'Entendendo o que sentimos.',
        content: [
            'No jardim mágico, cada flor era um sentimento.',
            'As rosas vermelhas eram o amor e carinho.',
            'Os girassóis amarelos eram a alegria.',
            'As violetas eram a calma e tranquilidade.',
            'Às vezes, nasciam espinhos... eram a tristeza.',
            'Mas com cuidado, até os espinhos floresciam.',
            'Nana aprendeu que todos sentimentos são importantes.',
            'Cada um tem seu lugar no jardim do coração.',
            'E juntos, fazem o jardim mais bonito. Fim! 🌸'
        ]
    },
    {
        id: 'book_8',
        title: 'Noite de Histórias',
        author: 'Mel Contador',
        genre: 'Contos',
        pages: 3,
        cover: '🌙',
        description: 'Hora de dormir com carinho.',
        content: [
            'Quando a lua aparece, é hora de descansar.',
            'Fefe e Nana se aconchegam debaixo do cobertor.',
            'E sonham com aventuras para o dia seguinte. Boa noite! 😴'
        ]
    }
];

// Get unread books
export function getUnreadBooks(progress: ReadingProgress[]): Book[] {
    const completedIds = progress.filter(p => p.completed).map(p => p.bookId);
    return BOOKS_LIBRARY.filter(b => !completedIds.includes(b.id));
}

// Get book by id
export function getBookById(id: string): Book | undefined {
    return BOOKS_LIBRARY.find(b => b.id === id);
}

// Calculate rewards based on book
export function calculateReadingRewards(book: Book): {
    energy: number;
    curiosidade: number;
    persistencia: number;
    amor: number;
} {
    // Shorter books = more love, longer books = more cognitive gains
    const baseCuriosity = Math.min(5, book.pages);
    const basePersistence = Math.floor(book.pages / 2);
    const amor = book.pages <= 5 ? 8 : book.pages <= 7 ? 5 : 3;
    const energyLoss = Math.min(15, book.pages * 2);

    return {
        energy: -energyLoss,
        curiosidade: baseCuriosity,
        persistencia: basePersistence,
        amor
    };
}
