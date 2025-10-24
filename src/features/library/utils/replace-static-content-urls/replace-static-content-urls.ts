import { FileStorageController, FileStorageEncoding } from 'src/controllers';
import {
    INJECTED_CSS_ID,
    INJECTED_CSS_PLACEHOLDER,
    FONT_CSS_ID,
    FONT_CSS_PLACEHOLDER,
    HIGHLIGHTS_CSS_ID,
    HIGHLIGHTS_CSS_PLACEHOLDER,
} from 'src/features/book-frame/constants';
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
    
    const fontsStyleNode = `<style id="${FONT_CSS_ID}">${FONT_CSS_PLACEHOLDER}</style>`;
    const highlightsStyleNode = `<style id="${HIGHLIGHTS_CSS_ID}">${HIGHLIGHTS_CSS_PLACEHOLDER}</style>`;
    const injectedStyleNode = `<style id="${INJECTED_CSS_ID}">${INJECTED_CSS_PLACEHOLDER}</style>`;
    
    modifiedFileContent = modifiedFileContent.replace(
        '</head>',
        `${fontsStyleNode}
        ${highlightsStyleNode}
        ${injectedStyleNode}
        </head>`
    );
    
    await FileStorageController.writeFile({
        path: fileFullPath,
        data: modifiedFileContent,
        encoding: FileStorageEncoding.UTF8,
    });
}
