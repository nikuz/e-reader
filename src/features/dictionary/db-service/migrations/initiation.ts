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
            explanations TEXT,
            pronunciation TEXT,
            images TEXT,
            sourceLanguage VARCHAR NOT NULL,
            targetLanguage VARCHAR NOT NULL,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
            updatedAt TEXT
        );`,
        `
        CREATE INDEX IF NOT EXISTS "${DICTIONARY_DB_CONFIG.indexName}"
        ON "${DICTIONARY_DB_CONFIG.name}"(word, translation)
        `
    ],
};