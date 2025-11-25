import { db } from 'src/controllers';
import type { LanguageCode } from 'src/types';
import { getLanguageByCode } from '../utils';
import type {
    DictionaryWord,
    DictionaryWordDBInstance,
} from '../types';

export async function getWordsListFromDB(props: {
    from: number,
    to: number,
}): Promise<{
    words: DictionaryWord[],
    counter: number,
}> {
    const { from, to } = props;
    const wordsRequest = db.query(
        `
            SELECT id, text, translation, pronunciation, sourceLanguage, targetLanguage, createdAt, updatedAt
            FROM "dictionary-words"
            ORDER BY createdAt DESC
            LIMIT :limit OFFSET :offset;
        `,
        [to - from, from]
    );
    const wordsCounterRequest = db.query('SELECT COUNT(id) FROM "dictionary-words"');
    const [words, wordsCounter] = await Promise.all([wordsRequest, wordsCounterRequest]);

    if (!words) {
        return {
            words: [],
            counter: 0,
        };
    }

    return {
        words: words.map((item: DictionaryWordDBInstance): DictionaryWord => ({
            ...item,
            contexts: [],
            contextExplanations: [],
            contextImages: [],
            sourceLanguage: getLanguageByCode(item.sourceLanguage as LanguageCode),
            targetLanguage: getLanguageByCode(item.targetLanguage as LanguageCode),
        })),
        counter: wordsCounter?.[0]['COUNT(id)'] ?? 0,
    };
}