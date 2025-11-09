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
    text: string,
    sourceLanguage: Language,
    targetLanguage: Language,
}): Promise<DictionaryWord | undefined> {
    const { db, text, sourceLanguage, targetLanguage } = props;

    const response = await db.query(
        `SELECT * FROM "${DICTIONARY_DB_CONFIG.name}" WHERE text=? AND sourceLanguage=? AND targetLanguage=?;`,
        [text, sourceLanguage.code, targetLanguage.code]
    );

    if (!response || !response[0]) {
        return;
    }

    const existingWord = response[0] as DictionaryWordDBInstance;
    console.log(existingWord);
    
    return {
        ...existingWord,
        contexts: JSON.parse(existingWord.contexts),
        contextExplanations: JSON.parse(existingWord.contextExplanations),
        contextImages: JSON.parse(existingWord.contextImages),
        sourceLanguage: Languages[existingWord.sourceLanguage as LanguageKey],
        targetLanguage: Languages[existingWord.targetLanguage as LanguageKey],
    };
}