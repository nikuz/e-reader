import { fromPromise } from 'xstate';
import { db } from 'src/controllers';

export const databaseCleanerActor = fromPromise(async (): Promise<void> => {
    if (!import.meta.env.DEV) {
        alert('Not available in production');
        return;
    }

    await db.deleteDB();

    window.location.reload();
});
