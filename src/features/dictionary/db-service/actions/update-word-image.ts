import { DatabaseController } from 'src/controllers';
import { DICTIONARY_DB_CONFIG } from '../../constants';
import type { DictionaryWord } from '../../types';

export async function updateWordImageInDB(props: {
    db: DatabaseController,
    word: DictionaryWord,
    image: string,
}): Promise<void> {
    const { db, word, image } = props;

    await db.execute(
        `
            UPDATE "${DICTIONARY_DB_CONFIG.name}"
            SET image=:image, updatedAt=datetime("now")
            WHERE id=:id;
        `,
        [image, word.id]
    );
}