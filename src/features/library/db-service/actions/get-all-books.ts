import { Capacitor } from '@capacitor/core';
import { DatabaseController } from 'src/controllers';
import type { BookAttributes } from 'src/types';

export async function getAllBooksFromDB(db: DatabaseController<BookAttributes>): Promise<BookAttributes[]> {
    if (Capacitor.isNativePlatform()) {
        const storedBooks = await db.readAll() as unknown as Record<'attributes', string>[];
        return storedBooks.map(item => JSON.parse(item.attributes));
    } else {
        return await db.readAll();
    }
}