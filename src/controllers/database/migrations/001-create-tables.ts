import type { DatabaseMigration } from '../types';

export const createTables: DatabaseMigration = {
    toVersion: 1,
    statements: [
        // library
        `CREATE TABLE IF NOT EXISTS "books" (
            id VARCHAR PRIMARY KEY,
            title TEXT NOT NULL COLLATE NOCASE,
            author TEXT NOT NULL COLLATE NOCASE,
            attributes TEXT NOT NULL,
            highlights TEXT,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
            updatedAt TEXT
        );`,
        `
        CREATE INDEX IF NOT EXISTS "books_title_author_idx"
        ON "books"(title, author)
        `,

        // dictionary
        `CREATE TABLE IF NOT EXISTS "dictionary-words" (
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
            updatedAt TEXT,
            UNIQUE(text, sourceLanguage, targetLanguage)
        );`,
        `
        CREATE INDEX IF NOT EXISTS "words_text_translation_idx"
        ON "dictionary-words"(text, translation)
        `
    ],
};
