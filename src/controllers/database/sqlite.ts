import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import type { DatabaseAdapter, DatabaseConfig, DatabaseMigration } from './types';

type SQLiteQueryResult = {
    values?: Array<Record<string, unknown>>;
};

// SQLite implementation for native platforms using Capacitor plugin
export class SQLiteAdapter<T> implements DatabaseAdapter<T> {
    constructor(config: DatabaseConfig<T>) {
        this.config = config;
    }
    
    private sqliteConnection = new SQLiteConnection(CapacitorSQLite);
    private db: SQLiteDBConnection | null = null;
    private config: DatabaseConfig<T>;
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

    async create(data: T): Promise<void>;
    async create(query: string, values?: any[]): Promise<void>;
    async create(query: any, values?: any[]): Promise<void> {
        if (typeof query === 'string') {
            return this.rawQuery(query, values);
        }
    }

    async update(data: T): Promise<void>;
    async update(query: string, values?: any[]): Promise<void>;
    async update(query: any, values?: any[]): Promise<void> {
        if (typeof query === 'string') {
            return this.rawQuery(query, values);
        }
    }

    async delete(key: string): Promise<void> {
        const db = this.ensureDB();
        await db.run(
            `DELETE FROM "${this.config.name}" WHERE id = ?`,
            [key],
        );
    }

    async rawQuery(query: string, values?: any[]): Promise<void> {
        const db = this.ensureDB();
        await db.run(query, values);
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
}
