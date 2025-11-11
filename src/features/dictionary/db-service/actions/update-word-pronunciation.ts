import { DatabaseController } from 'src/controllers';
import { DICTIONARY_DB_CONFIG } from '../../constants';
import type { DictionaryWord } from '../../types';

export async function updateWordPronunciationInDB(props: {
    db: DatabaseController,
    word: DictionaryWord,
    pronunciation: string,
}): Promise<void> {
    const { db, word, pronunciation } = props;

    await db.execute(
        `
            UPDATE "${DICTIONARY_DB_CONFIG.name}"
            SET pronunciation=:pronunciation, updatedAt=datetime("now")
            WHERE id=:id;
        `,
        [pronunciation, word.id]
    );
}