import type { capSQLiteChanges } from '@capacitor-community/sqlite';
import { SQLiteAdapter } from './sqlite';
import type { DatabaseAdapter, DatabaseConfig, DatabaseMigration } from './types';

export class DatabaseController<T> {
    private adapter: DatabaseAdapter<T>;
    
    constructor(config: DatabaseConfig) {
        this.adapter = new SQLiteAdapter<T>(config);
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

    async query(query: string, values?: any[]): Promise<T[]> {
        return await this.adapter.query(query, values);
    }
    
    async execute(query: string, values?: any[]): Promise<capSQLiteChanges> {
        return await this.adapter.execute(query, values);
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

    async saveToStore(): Promise<void> {
        await this.adapter.saveToStore();
    }
}
