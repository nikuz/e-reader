import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding, type ReadFileResult } from '@capacitor/filesystem';
import { pathUtils } from 'src/utils';

export async function replaceStyleUrls(props: {
    xmlDoc: Document,
    chapterDirname: string,
    staticMapping: Map<string, string>,
}) {
    const {
        xmlDoc,
        chapterDirname,
        staticMapping,
    } = props;

    const links = xmlDoc.querySelectorAll('link');
    const cssUrlRegexp = /url\("?'?([^)]+?)"?'?\)/g;

    for (const link of links) {
        const href = link.getAttribute('href');
        if (!href) {
            continue;
        }

        
        const cachedStyleValue = staticMapping.get(href);
        if (cachedStyleValue) {
            link.setAttribute('href', cachedStyleValue);
            continue;
        }
        
        const styleSrc = pathUtils.join([chapterDirname, href]);
        
        let fileReadResponse: ReadFileResult;
        try {
            fileReadResponse = await Filesystem.readFile({
                path: styleSrc,
                directory: Directory.Documents,
                encoding: Encoding.UTF8,
            });
        } catch {
            continue;
        }

        let styleFileContent = fileReadResponse.data;
        if (styleFileContent instanceof Blob) {
            styleFileContent = await styleFileContent.text();
        }

        const styleSrcUri = await Filesystem.getUri({
            path: styleSrc,
            directory: Directory.Documents,
        });
        const styleFileUri = Capacitor.convertFileSrc(styleSrcUri.uri);
        staticMapping.set(href, styleFileUri);
        link.setAttribute('href', styleFileUri);

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
            const urlSrcUri = await Filesystem.getUri({
                path: urlSrc,
                directory: Directory.Documents,
            }); 
            const urlFileUri = Capacitor.convertFileSrc(urlSrcUri.uri);

            styleFileContent = styleFileContent.replace(urlValue, urlFileUri);
            staticMapping.set(urlValue, urlFileUri);
        }

        await Filesystem.writeFile({
            path: styleSrc,
            data: styleFileContent,
            directory: Directory.Documents,
            encoding: Encoding.UTF8,
        });
    }
}