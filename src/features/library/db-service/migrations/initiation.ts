import type { DatabaseMigration } from 'src/controllers';
import { LIBRARY_DB_CONFIG } from '../../constants';

export const initiation: DatabaseMigration = {
    toVersion: 1,
    statements: [
        `CREATE TABLE IF NOT EXISTS "${LIBRARY_DB_CONFIG.name}" (
            id string PRIMARY KEY,
            title TEXT NOT NULL,
            author TEXT NOT NULL,
            attributes TEXT NOT NULL
        );`
    ],
};