import type { DatabaseConfig } from 'src/controllers';
import type { BookAttributes } from 'src/types';

export const LIBRARY_DIRECTORY = 'books';

export const LIBRARY_DB_CONFIG: DatabaseConfig<BookAttributes> = {
    name: 'books-db',
    indexName: 'books',
    indexKeyPath: 'eisbn',
};