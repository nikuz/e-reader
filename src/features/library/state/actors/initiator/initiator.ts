import { fromPromise } from 'xstate';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { libraryDirectory } from '../../../constants';

export const initiatorActor = fromPromise(async () => {
    // create libraryDirectory if it doesn't exist yet
    try {
        await Filesystem.stat({
            path: libraryDirectory,
            directory: Directory.Documents,
        });
    } catch {
        await Filesystem.mkdir({
            path: libraryDirectory,
            directory: Directory.Documents,
        });    
    }
});