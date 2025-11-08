import { DatabaseController } from 'src/controllers';
import { DICTIONARY_DB_CONFIG, Languages } from '../../constants';
import type {
    DictionaryWord,
    Language,
    DictionaryWordDBInstance,
    LanguageKey,
} from '../../types';

export async function getWordFromDB(props: {
    db: DatabaseController,
    word: string,
    sourceLanguage: Language,
    targetLanguage: Language,
}): Promise<DictionaryWord | undefined> {
    const { db, word, sourceLanguage, targetLanguage } = props;

    const response = await db.query(
        `SELECT * FROM "${DICTIONARY_DB_CONFIG.name}" WHERE word=? AND sourceLanguage=? AND targetLanguage=?;`,
        [word, sourceLanguage.code, targetLanguage.code]
    );

    if (!response || !response[0]) {
        return;
    }

    const existingWord = response[0] as DictionaryWordDBInstance;
    
    return {
        ...existingWord,
        contexts: JSON.parse(existingWord.contexts),
        explanations: JSON.parse(existingWord.explanations),
        images: JSON.parse(existingWord.images),
        sourceLanguage: Languages[existingWord.sourceLanguage as LanguageKey],
        targetLanguage: Languages[existingWord.targetLanguage as LanguageKey],
    };
}