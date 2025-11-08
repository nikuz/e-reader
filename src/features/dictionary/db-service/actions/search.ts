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
            SELECT id, word, translation, pronunciation, images, sourceLanguage, targetLanguage, createdAt, updatedAt
            FROM "${DICTIONARY_DB_CONFIG.name}"
            WHERE
                word LIKE :searchPattern
                OR translation LIKE :searchPattern
            ORDER BY
                CASE 
                WHEN word LIKE :searchText THEN 1
                WHEN translation LIKE :searchText THEN 1
                WHEN word LIKE :searchPatternEnd THEN 2
                WHEN translation LIKE :searchPatternEnd THEN 2
                WHEN word LIKE :searchPatternStart THEN 3
                WHEN translation LIKE :searchPatternStart THEN 3
                ELSE 4
            END,
            word ASC,
            created_at DESC
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
        contexts: JSON.parse(item.contexts),
        explanations: JSON.parse(item.explanations),
        images: JSON.parse(item.images),
        sourceLanguage: Languages[item.sourceLanguage as LanguageKey],
        targetLanguage: Languages[item.targetLanguage as LanguageKey],
    }));
}