import type { capSQLiteChanges } from '@capacitor-community/sqlite';

// Storage adapter interface
export interface DatabaseAdapter<T> {
    init(upgrades?: DatabaseMigration[]): Promise<void>;

    isInitiated(): boolean;

    openDB: () => Promise<void>;

    closeDB: () => Promise<void>;

    get(key: string): Promise<T | undefined>;
    
    getAll(): Promise<T[]>;

    delete(key: string): Promise<void>;

    query(query: string, values?: any[]): Promise<T[]>;

    execute(query: string, values?: any[]): Promise<capSQLiteChanges>;

    clear(): Promise<void>;
    
    deleteDB(): Promise<void>;

    saveToStore(): Promise<void>;
}

// Configuration interface
export interface DatabaseConfig {
    name: string;
    indexName: string;
    version?: number;
}

export interface DatabaseMigration {
    toVersion: number,
    statements: string[],
}