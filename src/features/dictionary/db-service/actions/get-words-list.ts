import { DatabaseController } from 'src/controllers';
import { getLanguageByCode } from '../../utils';
import { DICTIONARY_DB_CONFIG } from '../../constants';
import type {
    DictionaryWord,
    DictionaryWordDBInstance,
    LanguageCode,
} from '../../types';

export async function getWordsListFromDB(props: {
    db: DatabaseController,
    from: number,
    to: number,
}): Promise<DictionaryWord[]> {
    const { db, from, to } = props;
    const response = await db.query(
        `
            SELECT id, text, translation, pronunciation, sourceLanguage, targetLanguage, createdAt, updatedAt
            FROM "${DICTIONARY_DB_CONFIG.name}"
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