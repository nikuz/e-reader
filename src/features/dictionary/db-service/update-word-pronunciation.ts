import { db } from 'src/controllers';
import type { DictionaryWord } from '../types';

export async function updateWordPronunciationInDB(props: {
    word: DictionaryWord,
    pronunciation: string,
}): Promise<void> {
    const { word, pronunciation } = props;

    await db.run(
        `
            UPDATE "dictionary-words"
            SET pronunciation=:pronunciation, updatedAt=datetime("now")
            WHERE id=:id;
        `,
        [pronunciation, word.id]
    );
}