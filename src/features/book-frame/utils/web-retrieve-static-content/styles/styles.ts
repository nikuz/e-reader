import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

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

    for (const link of links) {
        const href = link.getAttribute('href')?.replace(Directory.Documents, '');
        if (!href) {
            continue;
        }

        const cachedBlobUrl = staticMapping.get(href);

        if (cachedBlobUrl) {
            link.setAttribute('href', cachedBlobUrl);
            continue;
        }

        const fileReadResponse = await Filesystem.readFile({
            path: href,
            directory: Directory.Documents,
            encoding: Encoding.UTF8,
        });

        let staticFileContent = fileReadResponse.data;
        if (staticFileContent instanceof Blob) {
            staticFileContent = await staticFileContent.text();
        }

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

                const urlSrc = urlValue.replace(Directory.Documents, '');
                const urlReadResponse = await Filesystem.readFile({
                    path: urlSrc,
                    directory: Directory.Documents,
                    encoding: Encoding.UTF8,
                });

                let urlFileContent = urlReadResponse.data;
                if (urlFileContent instanceof Blob) {
                    urlFileContent = await urlFileContent.text();
                }

                const urlContent = new Blob([urlFileContent]);
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