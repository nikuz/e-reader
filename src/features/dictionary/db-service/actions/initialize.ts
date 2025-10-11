import { Capacitor } from '@capacitor/core';
import { DatabaseController } from 'src/controllers';
import type { DictionaryWord } from '../../types';
import migrations from '../migrations';

export async function initializeDBService(db: DatabaseController<DictionaryWord>) {
    if (!db.isInitiated()) {
        if (Capacitor.isNativePlatform()) {
            await db.init(migrations);
        } else {
            await db.init();
        }
    }
    await db.openDB();
}