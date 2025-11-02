import type { DatabaseMigration } from 'src/controllers';
import { DICTIONARY_DB_CONFIG } from '../../constants';

export const initiation: DatabaseMigration = {
    toVersion: 1,
    statements: [
        `CREATE TABLE IF NOT EXISTS "${DICTIONARY_DB_CONFIG.name}" (
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            cloudId INTEGER,
            word TEXT NOT NULL COLLATE NOCASE,
            translation VARCHAR COLLATE NOCASE,
            contexts TEXT,
            aiExplanation TEXT,
            aiPronunciation TEXT,
            aiImage TEXT,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
            updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
        );`,
        `CREATE INDEX IF NOT EXISTS "${DICTIONARY_DB_CONFIG.indexName}"
        ON "${DICTIONARY_DB_CONFIG.name}"(word)`
    ],
};