import { fromPromise } from 'xstate';
import type { DatabaseController } from 'src/controllers';
import { deleteWordFromDB } from '../../../db-service/actions';

export const wordRemoverActor = fromPromise(async (props: {
    input: {
        dbController: DatabaseController,
        wordId: number,
    },
}): Promise<number> => {
    const { dbController, wordId } = props.input;

    await deleteWordFromDB({
        db: dbController,
        wordId,
    });

    return wordId;
});
