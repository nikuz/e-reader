import { fromPromise } from 'xstate';
import { FileStorageController } from 'src/controllers';
import type { DatabaseController } from 'src/controllers';
import { pathUtils } from 'src/utils';
import type { BookAttributes } from 'src/types';
import { libraryDirectory } from '../../../constants';

export const bookRemoverActor = fromPromise(async (props: {
    input: {
        bookAttributes: BookAttributes,
        dbController: DatabaseController<BookAttributes>,
    },
}): Promise<BookAttributes> => {
    const { bookAttributes, dbController } = props.input;

    await dbController.delete(bookAttributes.eisbn);

    const bookDirectory = pathUtils.join([libraryDirectory, bookAttributes.eisbn]);

    try {
        await FileStorageController.rmdir({
            path: bookDirectory,
            recursive: true,
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        // Ignore missing directories, rethrow otherwise
        if (!/not (found|exist)/i.test(message) && !/no such file/i.test(message)) {
            throw error;
        }
    }

    if (bookAttributes.cover?.startsWith('blob:')) {
        URL.revokeObjectURL(bookAttributes.cover);
    }

    return bookAttributes;
});
