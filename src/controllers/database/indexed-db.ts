import { openDB, deleteDB, type IDBPDatabase } from 'idb';
import type { DatabaseAdapter, DatabaseConfig, DatabaseMigration } from './types';

// IndexedDB implementation
export class IndexedDBAdapter<T> implements DatabaseAdapter<T> {
    constructor(config: DatabaseConfig<T>) {
        this.config = config;
    }

    private db: IDBPDatabase | null = null;
    private config: DatabaseConfig<T>;
    private initialized = false;

    private ensureDB(): IDBPDatabase {
        if (!this.db) {
            throw new Error('Database not initialized. Call init() first.');
        }
        return this.db;
    }

    async init(upgrades?: DatabaseMigration[]): Promise<void> {
        if (this.initialized) {
            return;
        }
        const db = await openDB(this.config.name, this.config.version ?? 1, {
            upgrade: (db) => {
                if (upgrades) {
                    // TODO: add proper upgrade logic
                    // return;
                }

                // Default upgrade: create object store if it doesn't exist
                if (!db.objectStoreNames.contains(this.config.indexName)) {
                    db.createObjectStore(this.config.indexName, {
                        keyPath: String(this.config.indexKeyPath),
                    });
                }
            },
        });
        this.initialized = true;
        db.close();
    }

    isInitiated(): boolean {
        return this.initialized;
    }

    async openDB(): Promise<void> {
        if (!this.db) {
            this.db = await openDB(this.config.name, this.config.version ?? 1);
        }
    }

    async closeDB(): Promise<void> {
        if (this.db) {
            this.db.close();
            this.db = null;
        }
    }

    async get(key: string): Promise<T | undefined> {
        const db = this.ensureDB();
        return db.get(this.config.indexName, key);
    }

    async getAll(): Promise<T[]> {
        const db = this.ensureDB();
        return db.getAll(this.config.indexName);
    }

    async create(data: T): Promise<void>;
    async create(query: string, values?: any[]): Promise<void>;
    async create(query: T | string, values?: any[]): Promise<void> {
        const db = this.ensureDB();
        if (typeof query === 'string' && values) {
            await db.put(this.config.indexName, values[0]);
        } else {
            await db.put(this.config.indexName, query);
        }
    }

    async update(data: T): Promise<void>;
    async update(query: string, values?: any[]): Promise<void>;
    async update(query: T | string, values?: any[]): Promise<void> {
        const db = this.ensureDB();
        if (typeof query === 'string' && values) {
            await db.put(this.config.indexName, values[0]);
        } else {
            await db.put(this.config.indexName, query);
        }
    }

    async delete(key: string): Promise<void> {
        const db = this.ensureDB();
        await db.delete(this.config.indexName, key);
    }

    async clear(): Promise<void> {
        const db = this.ensureDB();
        await db.clear(this.config.indexName);
    }

    // Count items in store
    async count(): Promise<number> {
        const db = this.ensureDB();
        return db.count(this.config.indexName);
    }

    // Check if key exists
    async has(key: string): Promise<boolean> {
        const item = await this.get(key);
        return item !== undefined;
    }

    async deleteDB(): Promise<void> {
        await deleteDB(this.config.name);
    }
}