import { fromPromise } from 'xstate';
import { FileStorageController } from 'src/controllers';
import type { DatabaseController } from 'src/controllers';
import { initializeDBService, getAllWordsFromDB } from '../../../db-service';
import { DICTIONARY_DIRECTORY } from '../../../constants';
import type { DictionaryWord } from '../../../types';

export const initializerActor = fromPromise(async (props: {
    input: {
        dbController: DatabaseController<DictionaryWord>,
    },
}): Promise<DictionaryWord[]> => {
    try {
        await FileStorageController.stat({ path: DICTIONARY_DIRECTORY });
    } catch {
        await FileStorageController.mkdir({ path: DICTIONARY_DIRECTORY });    
    }

    const dbController = props.input.dbController;
    await initializeDBService(dbController);

    const storedWords = await getAllWordsFromDB(dbController);
    storedWords.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    console.log('Dictionary initialized');

    return storedWords;
});
