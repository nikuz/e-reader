import { fromPromise } from 'xstate';
import { Filesystem, Directory } from '@capacitor/filesystem';
import JSZip from 'jszip';
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

    // console.log(unwrappedContent.files);
    const opfFile = unwrappedContent.file(/\.opf/)[0];

    if (!opfFile) {
        throw new Error('Book doesn\'t have .OPF file');
    }

    const opfContent = await opfFile.async('text');
    console.log(opfContent);

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

    // await Filesystem.writeFile({
    //     path: "secrets/text.txt",
    //     data: "This is a test",
    //     directory: Directory.Documents,
    //     encoding: Encoding.UTF8,
    // });
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