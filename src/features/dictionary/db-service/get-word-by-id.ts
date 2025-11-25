import { db } from 'src/controllers';
import type { LanguageCode } from 'src/types';
import { getLanguageByCode } from '../utils';
import type {
    DictionaryWord,
    DictionaryWordDBInstance,
} from '../types';

export async function getWordByIdFromDB(props: {
    id: number,
}): Promise<DictionaryWord | undefined> {
    const { id } = props;

    const response = await db.query(
        'SELECT * FROM "dictionary-words" WHERE id=?;',
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