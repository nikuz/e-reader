import { Capacitor } from '@capacitor/core';
import { IndexedDBAdapter } from './indexed-db';
import { SQLiteAdapter } from './sqlite';
import type { DatabaseAdapter, DatabaseConfig, DatabaseMigration } from './types';

export class DatabaseController<T> {
    private adapter: DatabaseAdapter<T>;
    
    constructor(config: DatabaseConfig<T>) {
        if (Capacitor.isNativePlatform()) {
            this.adapter = new SQLiteAdapter<T>(config);
        } else {
            this.adapter = new IndexedDBAdapter<T>(config);
        }
    }

    async init(upgrades?: DatabaseMigration[]): Promise<void> {
        await this.adapter.init(upgrades);
    }

    isInitiated(): boolean {
        return this.adapter.isInitiated(); 
    }

    async openDB(): Promise<void> {
        await this.adapter.openDB();
    }

    async closeDB(): Promise<void> {
        await this.adapter.closeDB();
    }

    async read(key: string): Promise<T | undefined> {
        return this.adapter.get(key);
    }

    async readAll(): Promise<T[]> {
        return this.adapter.getAll();
    }

    async create(data: T): Promise<void>;
    async create(query: string, values?: any[]): Promise<void>;
    async create(query: T | string, values?: any[]): Promise<void> {
        await this.adapter.create(query, values);
    }

    async update(data: T): Promise<void>;
    async update(query: string, values?: any[]): Promise<void>;
    async update(query: T | string, values?: any[]): Promise<void> {
        await this.adapter.update(query, values);
    }

    async delete(key: string): Promise<void> {
        await this.adapter.delete(key);
    }

    async clear(): Promise<void> {
        await this.adapter.clear();
    }
    
    async deleteDB(): Promise<void> {
        if (!import.meta.env.DEV) {
            throw new Error('DatabaseController.deleteDB() is only available in development mode.');
        }

        await this.adapter.deleteDB();
    }
}
