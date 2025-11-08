// Storage adapter interface
export interface DatabaseAdapter<T> {
    init(upgrades?: DatabaseMigration[]): Promise<void>;

    isInitiated(): boolean;

    openDB: () => Promise<void>;

    closeDB: () => Promise<void>;

    get(key: string): Promise<T | undefined>;
    
    getAll(): Promise<T[]>;

    create(query: string, values?: any[]): Promise<void>;

    update(query: string, values?: any[]): Promise<void>;

    delete(key: string): Promise<void>;

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