import { fromPromise } from 'xstate';
import { FileStorageController, FileStorageEncoding } from 'src/controllers';
import JSZip from 'jszip';
import type { DatabaseController } from 'src/controllers';
import { pathUtils, fileReaderUtils, imageUtils } from 'src/utils';
import type { BookAttributes } from 'src/types';
import { createBookInDB, deleteBookFromDB } from '../../../db-service';
import {
    retrieveBookAttributes,
    generateFakeIsbn,
    replaceStaticContentUrls,
    getBookCoverObjectUrl,
    retrieveNavigationEpub2,
} from '../../../utils';
import { LIBRARY_DIRECTORY } from '../../../constants';
import { Book } from 'src/models';

export const fileOpenerActor = fromPromise(async (props: {
    input: {
        file: File,
        dbController: DatabaseController<BookAttributes>,
    },
}): Promise<Book | undefined> => {
    const { file } = props.input;
    const zip = new JSZip();

    const fileContent = await fileReaderUtils.readAsArrayBuffer(file);
    const unwrappedContent = await zip.loadAsync(fileContent);

    const opfFile = unwrappedContent.file(/\.opf/)[0];
    if (!opfFile) {
        throw new Error('Book doesn\'t have .OPF file');
    }

    const opfContent = await opfFile.async('text');
    const bookAttributes = await retrieveBookAttributes(opfContent);

    if (!bookAttributes.eisbn) {
        bookAttributes.eisbn = generateFakeIsbn(bookAttributes.author, bookAttributes.title);
    }

    const bookRootDirectory = pathUtils.join([LIBRARY_DIRECTORY, bookAttributes.eisbn]);

    // if book directory already exists, don't proceed
    try {
        const bookDirectoryStats = await FileStorageController.stat({ path: bookRootDirectory });
        if (bookDirectoryStats) {
            // recreate directory in dev only
            if (import.meta.env.DEV) {
                await deleteBookFromDB(props.input.dbController, bookAttributes);
                await FileStorageController.rmdir({
                    path: bookRootDirectory,
                    recursive: true,
                });
                await FileStorageController.mkdir({ path: bookRootDirectory });
                console.log('Book directory recreated');
            } else {
                return;
            }
        }
    } catch {
        await FileStorageController.mkdir({ path: bookRootDirectory });
    }

    const fileNames = Object.keys(unwrappedContent.files);
    fileNames.sort((a, b) => a.length - b.length);
    
    // if archive has root folder, add it to the book dirname
    if (unwrappedContent.files[fileNames[0]].dir) {
        bookAttributes.dirname = pathUtils.join([bookRootDirectory, fileNames[0]]);
    }
    // otherwise use bookRootDirectory
    else {
        bookAttributes.dirname = bookRootDirectory;
    }

    await createBookFoldersFromArchive(unwrappedContent.files, bookRootDirectory);

    const saveFileJobs: Promise<void>[] = [];
    for (const fileName in unwrappedContent.files) {
        saveFileJobs.push(saveFileFromArchive(unwrappedContent.files[fileName], bookRootDirectory));
    }
    await Promise.all(saveFileJobs);

    if (bookAttributes.navigationEpub3Src) {
        await replaceStaticContentUrls({
            filePath: bookAttributes.navigationEpub3Src,
            bookDirectory: bookAttributes.dirname,
        });
    } else if (bookAttributes.navigationEpub2Src) {
        bookAttributes.navigationEpub2 = await retrieveNavigationEpub2(bookAttributes);
    }

    for (const chapter of bookAttributes.spine) {
        await replaceStaticContentUrls({
            filePath: chapter.filePath,
            bookDirectory: bookAttributes.dirname,
        });
    }

    await createBookInDB(props.input.dbController, bookAttributes);

    const newBook = new Book(bookAttributes);
    newBook.cover = await getBookCoverObjectUrl(bookAttributes);

    return newBook;
});

async function createBookFoldersFromArchive(
    files: Record<string, JSZip.JSZipObject>,
    bookDirectory: string,
): Promise<void> {
    const uniqueFolders = new Set<string>();
    for (const fileName in files) {
        if (fileName.indexOf('/') === -1) {
            continue;
        }
        const folderName = fileName.slice(0, fileName.lastIndexOf('/'));
        uniqueFolders.add(folderName);
    }

    for (const folder of uniqueFolders) {
        const folderPath = pathUtils.join([bookDirectory, folder]);
        await FileStorageController.mkdir({
            path: folderPath,
            recursive: true,
        });
    }
}

const fontRegex = /\.(ttf|otf|woff2?|eot)$/i;

async function saveFileFromArchive(
    file: JSZip.JSZipObject,
    bookDirectory: string,
): Promise<void> {
    if (file.dir) {
        return;
    }

    const filePath = pathUtils.join([bookDirectory, file.name]);
    const isImage = imageUtils.isImage(filePath);
    const isFont = fontRegex.test(filePath);
    const isBinary = isImage || isFont;

    await FileStorageController.writeFile({
        path: filePath,
        data: isBinary
            ? await file.async('base64')
            : await file.async('text'),
        encoding: isBinary
            ? undefined
            : FileStorageEncoding.UTF8,
    });
}
