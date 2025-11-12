import { fromPromise } from 'xstate';
import { deleteWordFromDB } from '../../../db-service';

export const wordRemoverActor = fromPromise(async (props: {
    input: {
        wordId: number,
    },
}): Promise<number> => {
    const { wordId } = props.input;

    await deleteWordFromDB({
        wordId,
    });

    return wordId;
});
