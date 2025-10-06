import { FileStorageController, FileStorageEncoding } from 'src/controllers';
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
    const fileReadResponse = await FileStorageController.readFile({
        path: chapterFullPath,
        encoding: FileStorageEncoding.UTF8,
    });

    let fileContent = fileReadResponse.data;
    if (fileContent instanceof Blob) {
        fileContent = await fileContent.text();
    }

    const chapterDirname = chapterFullPath.slice(0, chapterFullPath.lastIndexOf('/'));

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
        path: chapterFullPath,
        data: modifiedFileContent,
        encoding: FileStorageEncoding.UTF8,
    });
}
