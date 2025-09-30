import { fromPromise } from 'xstate';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import JSZip from 'jszip';
import { pathUtils } from 'src/utils';
import {
    retrieveBookAttributes,
    generateFakeIsbn,
} from '../../../utils';
import { libraryDirectory } from '../../../constants';

export const fileOpenerActor = fromPromise(async (props: {
    input: {
        file: File,
    },
}) => {
    const { file } = props.input;
    const zip = new JSZip();

    const fileContent = await readFileAsArrayBuffer(file);
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

    const bookDirectory = pathUtils.join([libraryDirectory, bookAttributes.eisbn]);
    bookAttributes.dirname = bookDirectory;

    // if book directory already exists, don't proceed
    try {
        const bookDirectoryStats = await Filesystem.stat({
            path: bookDirectory,
            directory: Directory.Documents,
        });
        if (bookDirectoryStats) {
            // recreate directory in dev only
            if (import.meta.env.DEV) {
                await Filesystem.rmdir({
                    path: bookDirectory,
                    directory: Directory.Documents,
                    recursive: true,
                });
                await Filesystem.mkdir({
                    path: bookDirectory,
                    directory: Directory.Documents,
                });
                console.log('Book directory recreated');
            } else {
                return;
            }
        }
    } catch {
        await Filesystem.mkdir({
            path: bookDirectory,
            directory: Directory.Documents,
        });
    }

    for (const fileName in unwrappedContent.files) {
        await saveFileFrom(unwrappedContent.files[fileName], bookDirectory);
    }
});

async function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            resolve(event.target?.result as ArrayBuffer);
        };

        reader.onerror = (event) => {
            reject(event.target?.error);
        };

        reader.readAsArrayBuffer(file);
    });
}

async function saveFileFrom(file: JSZip.JSZipObject, bookDirectory: string): Promise<void> {
    if (file.dir) {
        return;
    }

    const filePath = pathUtils.join([bookDirectory, file.name]);
    
    await Filesystem.writeFile({
        path: filePath,
        data: await file.async('blob'),
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
        recursive: true,
    });
}