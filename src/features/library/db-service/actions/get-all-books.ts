import { DatabaseController } from 'src/controllers';
import type { BookAttributes, BookHighlight } from 'src/types';

interface SqliteResponse {
    attributes: string,
    highlights: string | null,
}

export async function getAllBooksFromDB(db: DatabaseController): Promise<BookAttributes[]> {
    const storedBooks = await db.getAll();

    if (!storedBooks) {
        return [];
    }
    
    return storedBooks.map((item: SqliteResponse) => {
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
}