import type { IDBPDatabase } from 'idb';

// Storage adapter interface
export interface StorageAdapter<T> {
    init(): Promise<void>;
    get(key: string): Promise<T | undefined>;
    getAll(): Promise<T[]>;
    set(value: T): Promise<void>;
    delete(key: string): Promise<void>;
    query(predicate: (item: T) => boolean): Promise<T[]>;
    clear(): Promise<void>;
}

// Configuration interface
export interface StorageConfig<T> {
    name: string;
    indexName: string;
    indexKeyPath: keyof T;
    version?: number;
    upgrade?: (db: IDBPDatabase) => void;
}