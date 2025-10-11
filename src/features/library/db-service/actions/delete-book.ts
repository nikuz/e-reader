import { DatabaseController } from 'src/controllers';
import type { BookAttributes } from '../../types';

export async function deleteBookFromDB(db: DatabaseController<BookAttributes>, book: BookAttributes) {
    await db.delete(book.eisbn);
}