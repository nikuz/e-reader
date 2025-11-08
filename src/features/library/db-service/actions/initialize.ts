import { DatabaseController } from 'src/controllers';
import type { BookAttributes } from 'src/types';
import migrations from '../migrations';

export async function initializeDBService(db: DatabaseController<BookAttributes>) {
    if (!db.isInitiated()) {
        await db.init(migrations);
    }
    await db.openDB();
}