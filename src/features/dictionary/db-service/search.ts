import { db } from 'src/controllers';
import { getLanguageByCode } from '../utils';
import type {
    DictionaryWord,
    DictionaryWordDBInstance,
    LanguageCode,
} from '../types';

export async function searchInDB(props: {
    searchText: string,
    from: number,
    to: number,
}): Promise<DictionaryWord[]> {
    const { searchText, from, to } = props;
    const searchPattern = `%${searchText}%`;
    const searchPatternStart = `%${searchText}`;
    const searchPatternEnd = `${searchText}%`;

    const response = await db.query(
        `
            SELECT id, text, translation, pronunciation, sourceLanguage, targetLanguage, createdAt, updatedAt
            FROM "dictionary-words"
            WHERE
                text LIKE :searchPattern
                OR translation LIKE :searchPattern
            ORDER BY
                CASE 
                    WHEN text LIKE :searchText THEN 1
                    WHEN translation LIKE :searchText THEN 1
                    WHEN text LIKE :searchPatternEnd THEN 2
                    WHEN translation LIKE :searchPatternEnd THEN 2
                    WHEN text LIKE :searchPatternStart THEN 3
                    WHEN translation LIKE :searchPatternStart THEN 3
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