import type { DatabaseConfig } from 'src/controllers';

export const LIBRARY_DIRECTORY = 'books';
export const LIBRARY_LAST_SELECTED_BOOK_STORAGE_KEY = 'last-selected-book';

export const LIBRARY_DB_CONFIG: DatabaseConfig = {
    name: 'books-db',
    indexName: 'books',
    version: 1,
};