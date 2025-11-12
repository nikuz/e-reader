import { db } from 'src/controllers';
import { getLanguageByCode } from '../utils';
import type {
    DictionaryWord,
    DictionaryWordDBInstance,
    LanguageCode,
} from '../types';

export async function getWordsListFromDB(props: {
    from: number,
    to: number,
}): Promise<DictionaryWord[]> {
    const { from, to } = props;
    const response = await db.query(
        `
            SELECT id, text, translation, pronunciation, sourceLanguage, targetLanguage, createdAt, updatedAt
            FROM "dictionary-words"
            ORDER BY createdAt DESC
            LIMIT :limit OFFSET :offset;
        `,
        [to - from, from]
    );

    if (!response) {
        return [];
    }

    return response.map((item: DictionaryWordDBInstance): DictionaryWord => ({
        ...item,
        contexts: [],
        contextExplanations: [],
        contextImages: [],
        sourceLanguage: getLanguageByCode(item.sourceLanguage as LanguageCode),
        targetLanguage: getLanguageByCode(item.targetLanguage as LanguageCode),
    }));
}