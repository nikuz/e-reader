import { db } from 'src/controllers';
import type { BookAttributes } from 'src/types';

export async function deleteBookFromDB(book: BookAttributes) {
    await db.execute('DELETE FROM "books" WHERE id = ?', [book.eisbn]);
}