import { DatabaseController } from 'src/controllers';
import type { DictionaryWord } from '../../types';

export async function getAllWordsFromDB(db: DatabaseController<DictionaryWord>): Promise<DictionaryWord[]> {
    return await db.readAll();
}