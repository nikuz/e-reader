import { DatabaseController } from 'src/controllers';
import { DICTIONARY_DB_CONFIG } from '../../constants';

export async function deleteWordFromDB(props: {
    db: DatabaseController,
    wordId: number,
}): Promise<void> {
    const { db, wordId } = props;

    await db.execute(
        `
            DELETE FROM "${DICTIONARY_DB_CONFIG.name}"
            WHERE id = :wordId;
        `,
        [wordId]
    );
}
