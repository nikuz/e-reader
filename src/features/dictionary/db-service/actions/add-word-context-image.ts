import { DatabaseController } from 'src/controllers';
import { DICTIONARY_DB_CONFIG } from '../../constants';
import type { DictionaryWord, DictionaryWordContextImage } from '../../types';

export async function addWordContextImageInDB(props: {
    db: DatabaseController,
    word: DictionaryWord,
    contextImage: DictionaryWordContextImage,
}): Promise<void> {
    const {
        db,
        word,
        contextImage,
    } = props;
    
    await db.execute(
        `
            UPDATE "${DICTIONARY_DB_CONFIG.name}"
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