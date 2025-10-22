import {
    FileStorageController,
    FileStorageEncoding,
    FILE_STORAGE_DEFAULT_DIRECTORY,
} from 'src/controllers';
import { imageUtils } from 'src/utils';

export async function retrieveStyles(props: {
    xmlDoc: Document,
    staticMapping: Map<string, string>,
}) {
    const {
        xmlDoc,
        staticMapping,
    } = props;

    const links = xmlDoc.querySelectorAll('link');
    const cssUrlRegexp = /url\("?'?([^)]+?)"?'?\)/g;
    const directoryNameReg = `/${FILE_STORAGE_DEFAULT_DIRECTORY}`;

    for (const link of links) {
        const href = link.getAttribute('href')?.replace(directoryNameReg, '');
        if (!href) {
            continue;
        }

        const cachedBlobUrl = staticMapping.get(href);

        if (cachedBlobUrl) {
            link.setAttribute('href', cachedBlobUrl);
            continue;
        }

        const fileReadResponse = await FileStorageController.readFile({
            path: href,
            encoding: FileStorageEncoding.UTF8,
        });
        let staticFileContent = fileReadResponse.data;

        const urls = staticFileContent.match(cssUrlRegexp);

        if (urls) {
            for (const url of urls) {
                const urlValue = url.replace(cssUrlRegexp, '$1');

                const cachedBlobUrl = staticMapping.get(urlValue);
                if (cachedBlobUrl) {
                    staticFileContent = staticFileContent.replace(urlValue, cachedBlobUrl);
                    continue;
                }

                // ignore http and base64 urls
                if (urlValue.startsWith('http') || urlValue.startsWith('data:')) {
                    continue;
                }

                const urlSrc = urlValue.replace(directoryNameReg, '');
                const urlFileContent = await FileStorageController.readFile({
                    path: urlSrc,
                    encoding: FileStorageEncoding.UTF8,
                });

                let urlContent: Blob;
                if (imageUtils.isImage(urlSrc)) {
                    urlContent = imageUtils.base64ToBlob(urlFileContent.data);
                } else {
                    urlContent = new Blob([urlFileContent.data]); 
                }
                
                const blobUrl = URL.createObjectURL(urlContent);

                staticFileContent = staticFileContent.replace(urlValue, blobUrl);

                staticMapping.set(urlValue, blobUrl);
            }
        }

        const blob = new Blob([staticFileContent], { type: 'text/css' });
        const blobUrl = URL.createObjectURL(blob);

        link.setAttribute('href', blobUrl);

        staticMapping.set(href, blobUrl);
    }
}
