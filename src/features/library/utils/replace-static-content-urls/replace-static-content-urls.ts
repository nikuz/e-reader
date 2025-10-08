import { FileStorageController, FileStorageEncoding } from 'src/controllers';
import { INJECTED_CSS_PLACEHOLDER } from 'src/features/book-frame/constants';
import { pathUtils } from 'src/utils';
import { replaceStyleUrls } from './styles';
import { replaceImageUrls } from './images';

export async function replaceStaticContentUrls(props: {
    filePath: string,
    bookDirectory: string,
}) {
    const {
        filePath,
        bookDirectory,
    } = props;
    
    const fileFullPath = pathUtils.join([bookDirectory, filePath]);
    const fileReadResponse = await FileStorageController.readFile({
        path: fileFullPath,
        encoding: FileStorageEncoding.UTF8,
    });

    let fileContent = fileReadResponse.data;
    if (fileContent instanceof Blob) {
        fileContent = await fileContent.text();
    }

    const chapterDirname = fileFullPath.slice(0, fileFullPath.lastIndexOf('/'));
    const staticMapping = new Map();

    let modifiedFileContent = await replaceStyleUrls({
        fileContent,
        chapterDirname,
        staticMapping,
    });
    modifiedFileContent = await replaceImageUrls({
        fileContent: modifiedFileContent,
        chapterDirname,
        staticMapping,
    });
    
    modifiedFileContent = modifiedFileContent.replace('</head>', `<style>${INJECTED_CSS_PLACEHOLDER}</style></head>`);
    
    await FileStorageController.writeFile({
        path: fileFullPath,
        data: modifiedFileContent,
        encoding: FileStorageEncoding.UTF8,
    });
}
