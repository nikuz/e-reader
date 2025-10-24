import { Capacitor } from '@capacitor/core';
import { DatabaseController } from 'src/controllers';
import type { BookAttributes, BookHighlight } from '../../types';

interface SqliteResponse {
    attributes: string,
    highlights: string | null,
}

export async function getAllBooksFromDB(db: DatabaseController<BookAttributes>): Promise<BookAttributes[]> {
    if (Capacitor.isNativePlatform()) {
        const storedBooks = await db.readAll() as unknown as SqliteResponse[];
        return storedBooks.map(item => {
            const attributes = JSON.parse(item.attributes);
            let highlights: BookHighlight[][] = [];

            if (item.highlights) {
                highlights = JSON.parse(item.highlights);
            }

            return {
                ...attributes,
                highlights,
            };
        });
    } else {
        return await db.readAll();
    }
}