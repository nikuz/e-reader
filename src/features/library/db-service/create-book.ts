import { db } from 'src/controllers';
import type { BookAttributes } from 'src/types';

export async function createBookInDB(book: BookAttributes) {
    const query = `
        INSERT INTO "books" (
            id,
            title,
            author,
            attributes
        )
        VALUES(?, ?, ?, ?);
    `;
    const params: string[] = [
        book.eisbn,
        book.title,
        book.author,
        JSON.stringify(book),
    ];

    await db.execute(query, params);
}