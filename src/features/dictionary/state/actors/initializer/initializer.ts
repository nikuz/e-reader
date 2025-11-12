import { fromPromise } from 'xstate';
import { FileStorageController } from 'src/controllers';
import { DICTIONARY_DIRECTORY } from '../../../constants';

export const initializerActor = fromPromise(async (): Promise<void> => {
    try {
        await FileStorageController.stat({ path: DICTIONARY_DIRECTORY });
    } catch {
        await FileStorageController.mkdir({ path: DICTIONARY_DIRECTORY });
    }

    console.log('Dictionary initialized');
});
