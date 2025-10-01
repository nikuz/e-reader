import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { INJECTED_CSS_PLACEHOLDER } from 'src/features/book-frame/constants';
import { pathUtils } from 'src/utils';
import { replaceStyleUrls } from './styles';
import { replaceImageUrls } from './images';

export async function replaceStaticContentUrls(props: {
    chapterPath: string,
    bookDirectory: string,
    staticMapping: Map<string, string>,
}) {
    const {
        chapterPath,
        bookDirectory,
        staticMapping,
    } = props;
    
    const chapterFullPath = pathUtils.join([bookDirectory, chapterPath]);
    const fileReadResponse = await Filesystem.readFile({
        path: chapterFullPath,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
    });

    let fileContent = fileReadResponse.data;
    if (fileContent instanceof Blob) {
        fileContent = await fileContent.text();
    }

    const xmlDoc = new DOMParser().parseFromString(fileContent, 'text/xml');
    const chapterDirname = chapterFullPath.slice(0, chapterFullPath.lastIndexOf('/'));

    await Promise.all([
        replaceStyleUrls({
            xmlDoc,
            chapterDirname,
            staticMapping,
        }),
        replaceImageUrls({
            xmlDoc,
            chapterDirname,
            staticMapping,
        }),
    ]);

    const injectedStylePlaceholderNode = document.createElement('style');
    injectedStylePlaceholderNode.textContent = INJECTED_CSS_PLACEHOLDER;
    
    xmlDoc.head.appendChild(injectedStylePlaceholderNode);

    const serializer = new XMLSerializer();
    const modifiedContent = serializer.serializeToString(xmlDoc);

    await Filesystem.writeFile({
        path: chapterFullPath,
        data: modifiedContent,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
    });
}