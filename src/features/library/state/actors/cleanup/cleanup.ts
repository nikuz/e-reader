import { fromPromise } from 'xstate';
import type { DatabaseController } from 'src/controllers';

export const cleanupActor = fromPromise(async (props: {
    input: {
        dbController: DatabaseController,
    },
}): Promise<void> => {
    await props.input.dbController.closeDB();
});
