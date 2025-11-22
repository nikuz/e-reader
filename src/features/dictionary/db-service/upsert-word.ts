import { db } from 'src/controllers';
import type { DictionaryWord } from '../types';

export async function upsertWordInDB(props: {
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
            VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(text, sourceLanguage, targetLanguage) DO UPDATE SET
                translation = COALESCE(excluded.translation, translation),
                pronunciation = COALESCE(excluded.pronunciation, pronunciation),
                explanation = COALESCE(excluded.explanation, explanation),
                updatedAt = datetime("now");
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
