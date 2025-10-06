import { Capacitor } from '@capacitor/core';
import {
    FileStorageController,
    FileStorageEncoding,
    type FileStorageReadFileResult,
} from 'src/controllers';
import { pathUtils } from 'src/utils';

const linkRegexp = /<link.+?href=["']([^"']+)["'].*?>/gi;
const cssUrlRegexp = /url\("?'?([^)]+?)"?'?\)/gi;

export async function replaceStyleUrls(props: {
    fileContent: string,
    chapterDirname: string,
    staticMapping: Map<string, string>,
}): Promise<string> {
    const {
        fileContent,
        chapterDirname,
        staticMapping,
    } = props;

    let modifiedFileContent = fileContent;
    const links = fileContent.match(linkRegexp);

    if (!links) {
        return fileContent;
    }

    for (const link of links) {
        const href = link.replace(linkRegexp, '$1');
        if (!href) {
            continue;
        }

        
        const cachedStyleValue = staticMapping.get(href);
        if (cachedStyleValue) {
            modifiedFileContent = modifiedFileContent.replace(href, cachedStyleValue);
            continue;
        }
        
        const styleSrc = pathUtils.join([chapterDirname, href]);
        
        let fileReadResponse: FileStorageReadFileResult;
        try {
            fileReadResponse = await FileStorageController.readFile({
                path: styleSrc,
                encoding: FileStorageEncoding.UTF8,
            });
        } catch {
            continue;
        }

        let styleFileContent = fileReadResponse.data;
        if (styleFileContent instanceof Blob) {
            styleFileContent = await styleFileContent.text();
        }

        const styleSrcUri = await FileStorageController.getUri({ path: styleSrc });
        const styleFileUri = Capacitor.convertFileSrc(styleSrcUri.uri);
        staticMapping.set(href, styleFileUri);
        modifiedFileContent = modifiedFileContent.replace(href, styleFileUri);

        const urls = styleFileContent.match(cssUrlRegexp);
        if (!urls) {   
            continue;
        }

        const staticSrcDirname = styleSrc.slice(0, styleSrc.lastIndexOf('/'));

        for (const url of urls) {
            const urlValue = url.replace(cssUrlRegexp, '$1');

            // ignore http and base64 urls
            if (urlValue.startsWith('http') || urlValue.startsWith('data:')) {
                continue;
            }

            const cachedUrlValue = staticMapping.get(urlValue);
            if (cachedUrlValue) {
                styleFileContent = styleFileContent.replace(urlValue, cachedUrlValue);
                continue;
            }

            const urlSrc = pathUtils.join([staticSrcDirname, urlValue]);
            const urlSrcUri = await FileStorageController.getUri({ path: urlSrc }); 
            const urlFileUri = Capacitor.convertFileSrc(urlSrcUri.uri);

            styleFileContent = styleFileContent.replace(urlValue, urlFileUri);
            staticMapping.set(urlValue, urlFileUri);
        }

        await FileStorageController.writeFile({
            path: styleSrc,
            data: styleFileContent,
            encoding: FileStorageEncoding.UTF8,
        });
    }

    return modifiedFileContent;
}
