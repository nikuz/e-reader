import { db } from 'src/controllers';
import type { DictionaryWord } from '../types';

export async function createWordInDB(props: {
    bookId: string,
    word: DictionaryWord,
}): Promise<void> {
    const { bookId, word } = props;

    await db.run(
        `
            INSERT INTO "dictionary-words" (
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