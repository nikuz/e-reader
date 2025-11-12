import { DatabaseController } from './database';
import { migrations } from './migrations';

export const db = new DatabaseController({
    name: 'app-db',
    indexName: 'app',
    version: 1,
});

let initialized = false;

export async function initializeDatabase(): Promise<void> {
    if (initialized) {
        return;
    }

    await db.init(migrations);
    await db.openDB();
    initialized = true;
}
