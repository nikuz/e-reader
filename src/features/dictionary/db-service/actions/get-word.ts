import { DatabaseController } from 'src/controllers';
import { DICTIONARY_DB_CONFIG } from '../../constants';
import type { DictionaryWord, Language } from '../../types';

export async function getWordFromDB(props: {
    db: DatabaseController<DictionaryWord>,
    word: string,
    sourceLanguage: Language,
    targetLanguage: Language,
}): Promise<DictionaryWord | undefined> {
    const { db, word, sourceLanguage, targetLanguage } = props;

    const existingWord = await db.query(
        `SELECT * FROM "${DICTIONARY_DB_CONFIG.name}" WHERE word="?" AND sourceLanguage="?" AND targetLanguage="?";`,
        [word, sourceLanguage.code, targetLanguage.code]
    );
    
    return existingWord[0];
}