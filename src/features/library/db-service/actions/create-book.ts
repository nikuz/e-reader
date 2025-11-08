import { DatabaseController } from 'src/controllers';
import type { BookAttributes } from 'src/types';
import { LIBRARY_DB_CONFIG } from '../../constants';

export async function createBookInDB(db: DatabaseController, book: BookAttributes) {
    const query = `
        INSERT INTO "${LIBRARY_DB_CONFIG.name}" (
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