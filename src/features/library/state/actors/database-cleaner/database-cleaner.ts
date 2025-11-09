import { fromPromise } from 'xstate';
import type { DatabaseController } from 'src/controllers';

export const databaseCleanerActor = fromPromise(async (props: {
    input: {
        dbController: DatabaseController,
    },
}): Promise<void> => {
    if (!import.meta.env.DEV) {
        alert('Not available in production');
        return;
    }

    await props.input.dbController.deleteDB();

    window.location.reload();
});
