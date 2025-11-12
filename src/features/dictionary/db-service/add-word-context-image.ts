import { db } from 'src/controllers';
import type { DictionaryWord, DictionaryWordContextImage } from '../types';

export async function addWordContextImageInDB(props: {
    word: DictionaryWord,
    contextImage: DictionaryWordContextImage,
}): Promise<void> {
    const {
        word,
        contextImage,
    } = props;

    await db.execute(
        `
            UPDATE "dictionary-words"
            SET contextImages=:images, updatedAt=datetime("now")
            WHERE id=:id;
        `,
        [
            JSON.stringify([
                ...word.contextImages,
                contextImage,
            ]),
            word.id
        ]
    );
}