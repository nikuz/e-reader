import { DatabaseController } from 'src/controllers';
import { DICTIONARY_DB_CONFIG } from '../../constants';
import type { DictionaryWord } from '../../types';

export async function createWordInDB(props: {
    db: DatabaseController,
    word: DictionaryWord,
}): Promise<void> {
    const { db, word } = props;
    
    await db.execute(
        `
            INSERT INTO "${DICTIONARY_DB_CONFIG.name}" (
                word,
                translation,
                contexts,
                explanations,
                pronunciation,
                images,
                sourceLanguage,
                targetLanguage
            )
            VALUES(
                :word,
                :translation,
                :contexts,
                :explanations,
                :pronunciation,
                :images,
                :sourceLanguage,
                :targetLanguage
            );
        `,
        [
            word.word,
            word.translation,
            JSON.stringify(word.contexts),
            JSON.stringify(word.explanations),
            word.pronunciation,
            JSON.stringify(word.images),
            word.sourceLanguage.code,
            word.targetLanguage.code,
        ]
    );
}