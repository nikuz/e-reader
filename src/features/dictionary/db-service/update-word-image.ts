import { db } from 'src/controllers';
import type { DictionaryWord } from '../types';

export async function updateWordImageInDB(props: {
    word: DictionaryWord,
    image: string,
}): Promise<void> {
    const { word, image } = props;

    await db.execute(
        `
            UPDATE "dictionary-words"
            SET image=:image, updatedAt=datetime("now")
            WHERE id=:id;
        `,
        [image, word.id]
    );
}