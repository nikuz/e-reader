import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection, type capSQLiteChanges } from '@capacitor-community/sqlite';
import type { DatabaseAdapter, DatabaseConfig, DatabaseMigration } from './types';

if (import.meta.env.DEV && !Capacitor.isNativePlatform()) {
    import('jeep-sqlite/loader').then(module => {
        module.defineCustomElements(window);
        const jeepEl = document.createElement('jeep-sqlite');
        document.body.appendChild(jeepEl);
    });
}

type SQLiteQueryResult = {
    values?: Array<Record<string, unknown>>;
};

// SQLite implementation for native platforms using Capacitor plugin
export class SQLiteAdapter<T> implements DatabaseAdapter<T> {
    constructor(config: DatabaseConfig) {
        this.config = config;
    }
    
    private sqliteConnection = new SQLiteConnection(CapacitorSQLite);
    private db: SQLiteDBConnection | null = null;
    private config: DatabaseConfig;
    private initialized = false;

    private ensureDB(): SQLiteDBConnection {
        if (!this.db) {
            throw new Error('Database not initialized. Call init() first.');
        }

        return this.db;
    }

    async init(upgrades?: DatabaseMigration[]): Promise<void> {
        if (this.initialized) {
            return;
        }
        if (!Capacitor.isNativePlatform()) {
            await customElements.whenDefined('jeep-sqlite');
            await this.sqliteConnection.initWebStore();
        }
        if (upgrades) {
            CapacitorSQLite.addUpgradeStatement({
                database: this.config.name,
                upgrade: upgrades,
            });
        }
        this.initialized = true;
    }

    isInitiated(): boolean {
        return this.initialized;
    }

    async openDB(): Promise<void> {
        if (!this.db) {
            const isAlreadyConnected = (await this.sqliteConnection.isConnection(this.config.name, false)).result;
            const connectionIsConsistent = (await this.sqliteConnection.checkConnectionsConsistency()).result;

            if (isAlreadyConnected && connectionIsConsistent) {
                this.db = await this.sqliteConnection.retrieveConnection(this.config.name, false);
            } else {
                this.db = await this.sqliteConnection.createConnection(
                    this.config.name,
                    false,
                    'no-encryption',
                    this.config.version ?? 1,
                    false,
                );
            }
            await this.db.open();
        }
    }

    async closeDB(): Promise<void> {
        if (this.db) {
            await this.db.close();
            await this.sqliteConnection.closeConnection(this.config.name, false);
            this.db = null;
        }
    }

    async get(key: string): Promise<T | undefined> {
        const db = this.ensureDB();
        const result: SQLiteQueryResult = await db.query(
            `SELECT * FROM "${this.config.name}" WHERE id = ?`,
            [key],
        );

        return result.values?.[0]?.value as T | undefined;
    }

    async getAll(): Promise<T[]> {
        const db = this.ensureDB();
        const result: SQLiteQueryResult = await db.query(
            `SELECT * FROM "${this.config.name}"`,
        );

        return result.values as T[];
    }

    async delete(key: string): Promise<void> {
        const db = this.ensureDB();
        await db.run(
            `DELETE FROM "${this.config.name}" WHERE id = ?`,
            [key],
        );
    }

    async query(query: string, values?: any[]): Promise<T[]> {
        const db = this.ensureDB();
        return (await db.query(query, values)).values as T[];
    }

    async execute(query: string, values?: any[]): Promise<capSQLiteChanges> {
        const db = this.ensureDB();
        return await db.run(query, values);
    }

    async clear(): Promise<void> {
        const db = this.ensureDB();
        await db.run(`DELETE FROM "${this.config.name}"`, []);
    }

    async count(): Promise<number> {
        const db = this.ensureDB();
        const result: SQLiteQueryResult = await db.query(
            `SELECT COUNT(*) as count FROM "${this.config.name}"`,
        );

        const rawCount = result.values?.[0]?.count;

        return typeof rawCount === 'number'
            ? rawCount
            : Number(rawCount ?? 0);
    }

    async has(key: string): Promise<boolean> {
        const db = this.ensureDB();
        const result: SQLiteQueryResult = await db.query(
            `SELECT 1 FROM "${this.config.name}" WHERE id = ? LIMIT 1`,
            [key],
        );

        return Boolean(result.values?.length);
    }

    async deleteDB(): Promise<void> {
        await CapacitorSQLite.deleteDatabase({
            database: this.config.name,
        });
    }

    async saveToStore(): Promise<void> {
        await this.sqliteConnection.saveToStore(this.config.name);
    }
}
