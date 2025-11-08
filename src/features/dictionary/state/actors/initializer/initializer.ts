import { fromPromise } from 'xstate';
import { FileStorageController } from 'src/controllers';
import type { DatabaseController } from 'src/controllers';
import { initializeDBService } from '../../../db-service';
import { DICTIONARY_DIRECTORY } from '../../../constants';

export const initializerActor = fromPromise(async (props: {
    input: {
        dbController: DatabaseController,
    },
}): Promise<void> => {
    try {
        await FileStorageController.stat({ path: DICTIONARY_DIRECTORY });
    } catch {
        await FileStorageController.mkdir({ path: DICTIONARY_DIRECTORY });    
    }

    const dbController = props.input.dbController;
    await initializeDBService(dbController);
    // TODO: remove this after first version release
    // await dbController.deleteDB();

    console.log('Dictionary initialized');
});
