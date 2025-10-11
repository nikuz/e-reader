import { Capacitor } from '@capacitor/core';
import { DatabaseController } from 'src/controllers';
import { LIBRARY_DB_CONFIG } from '../../constants';
import type { BookAttributes } from '../../types';

export async function createBookInDB(db: DatabaseController<BookAttributes>, book: BookAttributes) {
    if (Capacitor.isNativePlatform()) {
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

        await db.create(query, params);
    } else {
        await db.create(book);
    }
}