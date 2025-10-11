import { Capacitor } from '@capacitor/core';
import { DatabaseController } from 'src/controllers';
import type { DictionaryWord } from '../../types';

export async function getAllWordsFromDB(db: DatabaseController<DictionaryWord>): Promise<DictionaryWord[]> {
    if (Capacitor.isNativePlatform()) {
        return await db.readAll();
    } else {
        return await db.readAll();
    }
}