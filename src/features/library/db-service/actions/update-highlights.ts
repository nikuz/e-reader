import { DatabaseController } from 'src/controllers';
import type { BookAttributes } from 'src/types';
import { LIBRARY_DB_CONFIG } from '../../constants';

export async function updateHighlightsInDB(db: DatabaseController<BookAttributes>, book: BookAttributes) {
    const query = `
        UPDATE "${LIBRARY_DB_CONFIG.name}"
        SET highlights=?
        WHERE id=?;
    `;
    const params: string[] = [
        JSON.stringify(book.highlights),
        book.eisbn,
    ];

    await db.update(query, params);

    // web only
    await db.saveToStore();
}