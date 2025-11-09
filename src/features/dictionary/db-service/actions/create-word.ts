import { DatabaseController } from 'src/controllers';
import { DICTIONARY_DB_CONFIG } from '../../constants';
import type { DictionaryWord } from '../../types';

export async function createWordInDB(props: {
    db: DatabaseController,
    bookId: string,
    word: DictionaryWord,
}): Promise<void> {
    const { db, bookId, word } = props;

    await db.execute(
        `
            INSERT INTO "${DICTIONARY_DB_CONFIG.name}" (
                bookId,
                text,
                translation,
                pronunciation,
                contexts,
                explanation,
                contextExplanations,
                image,
                contextImages,
                sourceLanguage,
                targetLanguage
            )
            VALUES(
                :bookId,
                :text,
                :translation,
                :pronunciation,
                :contexts,
                :explanation,
                :contextExplanations,
                :image,
                :contextImages,
                :sourceLanguage,
                :targetLanguage
            );
        `,
        [
            bookId,
            word.text,
            word.translation,
            word.pronunciation,
            JSON.stringify(word.contexts),
            word.explanation,
            JSON.stringify(word.contextExplanations),
            word.image,
            JSON.stringify(word.contextImages),
            word.sourceLanguage.code,
            word.targetLanguage.code,
        ]
    );
}