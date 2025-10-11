import { fromPromise } from 'xstate';
import type { DatabaseController } from 'src/controllers';
import type { BookAttributes } from '../../../types';

export const cleanupActor = fromPromise(async (props: {
    input: {
        dbController: DatabaseController<BookAttributes>,
    },
}): Promise<void> => {
    await props.input.dbController.closeDB();
});
