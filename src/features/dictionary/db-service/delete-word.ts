import { db } from 'src/controllers';

export async function deleteWordFromDB(props: {
    wordId: number,
}): Promise<void> {
    const { wordId } = props;

    await db.execute(
        `
            DELETE FROM "dictionary-words"
            WHERE id = :wordId;
        `,
        [wordId]
    );
}
