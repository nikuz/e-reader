import { DatabaseController } from 'src/controllers';
import { getLanguageByCode } from '../../utils';
import { DICTIONARY_DB_CONFIG } from '../../constants';
import type {
    DictionaryWord,
    DictionaryWordDBInstance,
    LanguageCode,
} from '../../types';

export async function getWordByIdFromDB(props: {
    db: DatabaseController,
    id: number,
}): Promise<DictionaryWord | undefined> {
    const { db, id } = props;

    const response = await db.query(
        `SELECT * FROM "${DICTIONARY_DB_CONFIG.name}" WHERE id=?;`,
        [id]
    );

    if (!response || !response[0]) {
        return;
    }

    const existingWord = response[0] as DictionaryWordDBInstance;
    
    return {
        ...existingWord,
        contexts: JSON.parse(existingWord.contexts),
        contextExplanations: JSON.parse(existingWord.contextExplanations),
        contextImages: JSON.parse(existingWord.contextImages),
        sourceLanguage: getLanguageByCode(existingWord.sourceLanguage as LanguageCode),
        targetLanguage: getLanguageByCode(existingWord.targetLanguage as LanguageCode),
    };
}