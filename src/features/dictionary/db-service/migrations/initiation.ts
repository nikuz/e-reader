import type { DatabaseMigration } from 'src/controllers';
import { DICTIONARY_DB_CONFIG } from '../../constants';

export const initiation: DatabaseMigration = {
    toVersion: 1,
    statements: [
        `CREATE TABLE IF NOT EXISTS "${DICTIONARY_DB_CONFIG.name}" (
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            cloudId INTEGER,
            bookId INTEGER NOT NULL,
            text TEXT NOT NULL COLLATE NOCASE,
            translation VARCHAR COLLATE NOCASE,
            contexts TEXT,
            explanation TEXT,
            contextExplanations TEXT,
            pronunciation TEXT,
            image TEXT,
            contextImages TEXT,
            sourceLanguage VARCHAR NOT NULL,
            targetLanguage VARCHAR NOT NULL,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
            updatedAt TEXT
        );`,
        `
        CREATE INDEX IF NOT EXISTS "${DICTIONARY_DB_CONFIG.indexName}"
        ON "${DICTIONARY_DB_CONFIG.name}"(text, translation)
        `
    ],
};