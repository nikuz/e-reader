import { openDB, type IDBPDatabase } from 'idb';
import type { StorageAdapter, StorageConfig } from './types';

// IndexedDB implementation
export class IndexedDBAdapter<T> implements StorageAdapter<T> {
    private db: IDBPDatabase | null = null;

    constructor(private config: StorageConfig<T>) { }

    async init(): Promise<void> {
        this.db = await openDB(this.config.name, this.config.version ?? 1, {
            upgrade: (db) => {
                // Use custom upgrade if provided
                if (this.config.upgrade) {
                    this.config.upgrade(db);
                    return;
                }

                // Default upgrade: create object store if it doesn't exist
                if (!db.objectStoreNames.contains(this.config.indexName)) {
                    db.createObjectStore(this.config.indexName, {
                        keyPath: String(this.config.indexKeyPath),
                    });
                }
            },
        });
    }

    private ensureDB(): IDBPDatabase {
        if (!this.db) {
            throw new Error('Database not initialized. Call init() first.');
        }
        return this.db;
    }

    async get(key: string): Promise<T | undefined> {
        const db = this.ensureDB();
        return db.get(this.config.indexName, key);
    }

    async getAll(): Promise<T[]> {
        const db = this.ensureDB();
        return db.getAll(this.config.indexName);
    }

    async set(value: T): Promise<void> {
        const db = this.ensureDB();
        await db.put(this.config.indexName, value);
    }

    async delete(key: string): Promise<void> {
        const db = this.ensureDB();
        await db.delete(this.config.indexName, key);
    }

    async query(predicate: (item: T) => boolean): Promise<T[]> {
        const all = await this.getAll();
        return all.filter(predicate);
    }

    async clear(): Promise<void> {
        const db = this.ensureDB();
        await db.clear(this.config.indexName);
    }

    // Close database connection
    async close(): Promise<void> {
        if (this.db) {
            this.db.close();
            this.db = null;
        }
    }

    // Bulk operations for better performance
    async bulkSet(items: T[]): Promise<void> {
        const db = this.ensureDB();
        const tx = db.transaction(this.config.indexName, 'readwrite');
        const store = tx.objectStore(this.config.indexName);

        await Promise.all([
            ...items.map(item => store.put(item)),
            tx.done,
        ]);
    }

    async bulkDelete(keys: string[]): Promise<void> {
        const db = this.ensureDB();
        const tx = db.transaction(this.config.indexName, 'readwrite');
        const store = tx.objectStore(this.config.indexName);

        await Promise.all([
            ...keys.map(key => store.delete(key)),
            tx.done,
        ]);
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
}