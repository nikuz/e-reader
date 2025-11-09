import { DatabaseController } from 'src/controllers';
import { DICTIONARY_DB_CONFIG, Languages } from '../../constants';
import type {
    DictionaryWord,
    DictionaryWordDBInstance,
    LanguageKey,
} from '../../types';

export async function searchInDB(props: {
    db: DatabaseController,
    searchText: string,
    from: number,
    to: number,
}): Promise<DictionaryWord[]> {
    const { db, searchText, from, to } = props;
    const searchPattern = `%${searchText}%`;
    const searchPatternStart = `%${searchText}`;
    const searchPatternEnd = `${searchText}%`;
    
    const response = await db.query(
        `
            SELECT id, text, translation, pronunciation, sourceLanguage, targetLanguage, createdAt, updatedAt
            FROM "${DICTIONARY_DB_CONFIG.name}"
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
        sourceLanguage: Languages[item.sourceLanguage as LanguageKey],
        targetLanguage: Languages[item.targetLanguage as LanguageKey],
    }));
}