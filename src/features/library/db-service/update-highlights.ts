import { db } from 'src/controllers';
import type { BookAttributes } from 'src/types';

export async function updateHighlightsInDB(book: BookAttributes) {
    const query = `
        UPDATE "books"
        SET highlights=?
        WHERE id=?;
    `;
    const params: string[] = [
        JSON.stringify(book.highlights),
        book.eisbn,
    ];

    await db.execute(query, params);
}