import { DatabaseController } from 'src/controllers';
import type { BookAttributes } from 'src/types';

export async function deleteBookFromDB(db: DatabaseController<BookAttributes>, book: BookAttributes) {
    await db.delete(book.eisbn);
}