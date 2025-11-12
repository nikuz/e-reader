import { db } from 'src/controllers';
import type { BookAttributes, BookHighlight } from 'src/types';

interface SqliteResponse {
    attributes: string,
    highlights: string | null,
}

export async function getBookById(bookId: string): Promise<BookAttributes | undefined> {
    const storedBook = (await db.query('SELECT * FROM "books" WHERE id=?', [bookId]))?.[0] as SqliteResponse;

    if (!storedBook) {
        return;
    }

    const attributes = JSON.parse(storedBook.attributes);
    let highlights: BookHighlight[][] = [];

    if (storedBook.highlights) {
        highlights = JSON.parse(storedBook.highlights);
    }

    return {
        ...attributes,
        highlights,
    };
}