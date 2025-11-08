import { DatabaseController } from 'src/controllers';
import type { DictionaryWord } from '../../types';
import migrations from '../migrations';

export async function initializeDBService(db: DatabaseController<DictionaryWord>) {
    if (!db.isInitiated()) {
        await db.init(migrations);
    }
    await db.openDB();
}