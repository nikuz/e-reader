// Storage adapter interface
export interface DatabaseAdapter<T> {
    init(upgrades?: DatabaseMigration[]): Promise<void>;

    isInitiated(): boolean;

    openDB: () => Promise<void>;

    closeDB: () => Promise<void>;

    get(key: string): Promise<T | undefined>;
    
    getAll(): Promise<T[]>;

    create(data: T): Promise<void>;
    create(query: string, values?: any[]): Promise<void>;
    create(query: T | string, values?: any[]): Promise<void>;

    update(data: T): Promise<void>;
    update(query: string, values?: any[]): Promise<void>;
    update(query: T | string, values?: any[]): Promise<void>;

    delete(key: string): Promise<void>;

    clear(): Promise<void>;
    
    deleteDB(): Promise<void>;
}

// Configuration interface
export interface DatabaseConfig<T> {
    name: string;
    indexName: string;
    indexKeyPath: keyof T;
    version?: number;
}

export interface DatabaseMigration {
    toVersion: number,
    statements: string[],
}