import type { DatabaseMigration } from 'src/controllers';
import { LIBRARY_DB_CONFIG } from '../../constants';

export const initiation: DatabaseMigration = {
    toVersion: 1,
    statements: [
        `CREATE TABLE IF NOT EXISTS "${LIBRARY_DB_CONFIG.name}" (
            id VARCHAR PRIMARY KEY,
            title TEXT NOT NULL COLLATE NOCASE,
            author TEXT NOT NULL COLLATE NOCASE,
            attributes TEXT NOT NULL,
            highlights TEXT
        );`,
        `
        CREATE INDEX IF NOT EXISTS "${LIBRARY_DB_CONFIG.indexName}"
        ON "${LIBRARY_DB_CONFIG.name}"(title, author)
        `
    ],
};