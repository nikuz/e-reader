import { DatabaseController } from 'src/controllers';
import { DICTIONARY_DB_CONFIG, Languages } from '../../constants';
import type {
    DictionaryWord,
    DictionaryWordDBInstance,
    LanguageKey,
} from '../../types';

export async function getWordsListFromDB(props: {
    db: DatabaseController,
    from: number,
    to: number,
}): Promise<DictionaryWord[]> {
    const { db, from, to } = props;
    const response = await db.query(
        `
            SELECT id, word, translation, pronunciation, images, sourceLanguage, targetLanguage, createdAt, updatedAt
            FROM ${DICTIONARY_DB_CONFIG.name}
            ORDER BY created_at DESC
            LIMIT :limit OFFSET :offset;
        `,
        [to - from, from]
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