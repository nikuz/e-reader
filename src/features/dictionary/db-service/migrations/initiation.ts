import type { DatabaseMigration } from 'src/controllers';
import { DICTIONARY_DB_CONFIG } from '../../constants';

export const initiation: DatabaseMigration = {
    toVersion: 1,
    statements: [
        `CREATE TABLE IF NOT EXISTS "${DICTIONARY_DB_CONFIG.name}" (
            id string PRIMARY KEY,
            word TEXT NOT NULL,
            translation TEXT NOT NULL,
            aiResponse TEXT NOT NULL
        );`
    ],
};