import { DatabaseController } from 'src/controllers';
import migrations from '../migrations';

export async function initializeDBService(db: DatabaseController) {
    if (!db.isInitiated()) {
        await db.init(migrations);
    }
    await db.openDB();
}