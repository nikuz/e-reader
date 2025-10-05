import { Capacitor } from '@capacitor/core';
import { IndexedDBAdapter } from './indexed-db';
import type { StorageAdapter, StorageConfig } from './types';

export class DatabaseController<T> {
    private adapter: StorageAdapter<T>;
    
    constructor(config: StorageConfig<T>) {
        if (Capacitor.isNativePlatform()) {
            // For now, always use IndexedDB adapter
            // TODO: add SQLite support for native platforms
            this.adapter = new IndexedDBAdapter<T>(config);
        } else {
            this.adapter = new IndexedDBAdapter<T>(config);
        }
    }

    async init(): Promise<void> {
        await this.adapter.init();
    }

    // CRUD operations
    async create(item: T): Promise<void> {
        await this.adapter.set(item);
    }

    async read(key: string): Promise<T | undefined> {
        return this.adapter.get(key);
    }

    async readAll(): Promise<T[]> {
        return this.adapter.getAll();
    }

    async update(item: T): Promise<void> {
        await this.create(item); // In key-value stores, set = upsert
    }

    async delete(key: string): Promise<void> {
        await this.adapter.delete(key);
    }

    async query(predicate: (item: T) => boolean): Promise<T[]> {
        return this.adapter.query(predicate);
    }
}