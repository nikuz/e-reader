import { fromPromise } from 'xstate';
import { Filesystem, Directory } from '@capacitor/filesystem';
import type { DatabaseController } from 'src/controllers';
import { pathUtils } from 'src/utils';
import type { BookAttributes } from 'src/types';
import { libraryDirectory } from '../../../constants';

export const initiatorActor = fromPromise(async (props: {
    input: {
        dbController: DatabaseController<BookAttributes>,
    },
}): Promise<BookAttributes[]> => {
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

    await props.input.dbController.init();
    const storedBooks = await props.input.dbController.readAll();

    for (const book of storedBooks) {
        if (book.cover) {
            const fileReadResponse = await Filesystem.readFile({
                path: pathUtils.join([book.dirname, book.cover]),
                directory: Directory.Documents,
            });

            let staticFileContent = fileReadResponse.data;
            if (staticFileContent instanceof Blob) {
                staticFileContent = await staticFileContent.text();
            }

            const extension = book.cover.replace(/.+\.([^.]+)$/, '$1');

            const url = `data:image/${extension};base64,${staticFileContent}`;
            const data = await (await fetch(url)).blob();

            book.cover = URL.createObjectURL(data);
        }
    }

    return storedBooks;
});