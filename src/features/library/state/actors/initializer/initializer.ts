import { fromPromise } from 'xstate';
import { FileStorageController } from 'src/controllers';
import { LIBRARY_DIRECTORY } from '../../../constants';

export const initializerActor = fromPromise(async (): Promise<void> => {
    try {
        await FileStorageController.stat({ path: LIBRARY_DIRECTORY });
    } catch {
        await FileStorageController.mkdir({ path: LIBRARY_DIRECTORY });
    }

    console.log('Library initialized');
});
