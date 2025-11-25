import { db } from 'src/controllers';
import type { LanguageCode } from 'src/types';
import { getLanguageByCode } from '../utils';
import type {
    DictionaryWord,
    DictionaryWordDBInstance,
} from '../types';

export async function searchInDB(props: {
    searchText: string,
    from: number,
    to: number,
}): Promise<{
    words: DictionaryWord[],
    counter: number,
}> {
    const { searchText, from, to } = props;
    const searchPattern = `%${searchText}%`;
    const searchPatternStart = `%${searchText}`;
    const searchPatternEnd = `${searchText}%`;

    const wordsRequest = db.query(
        `
            SELECT id, text, translation, pronunciation, sourceLanguage, targetLanguage, createdAt, updatedAt
            FROM "dictionary-words"
            WHERE
                text LIKE :searchPattern
                OR translation LIKE :searchPattern2
            ORDER BY
                CASE 
                    WHEN text LIKE :searchText THEN 1
                    WHEN translation LIKE :searchText2 THEN 1
                    WHEN text LIKE :searchPatternEnd THEN 2
                    WHEN translation LIKE :searchPatternEnd2 THEN 2
                    WHEN text LIKE :searchPatternStart THEN 3
                    WHEN translation LIKE :searchPatternStart2 THEN 3
                    ELSE 4
                END,
                text ASC,
                createdAt DESC
            LIMIT :limit OFFSET :offset;
        `,
        [
            searchPattern,
            searchPattern,
            searchText,
            searchText,
            searchPatternEnd,
            searchPatternEnd,
            searchPatternStart,
            searchPatternStart,
            to - from,
            from,
        ]
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