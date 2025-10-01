import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

export async function retrieveStaticContent(props: {
    xmlDoc: Document,
    staticMapping: Map<string, string>,
}) {
    const { 
        xmlDoc,
        staticMapping,
    } = props;

    await Promise.all([
        retrieveStyles({
            xmlDoc,
            staticMapping,
        }),
        retrieveImages({
            xmlDoc,
            staticMapping,
        }),
    ]);
}

async function retrieveStyles(props: {
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

async function retrieveImages(props: {
    xmlDoc: Document,
    staticMapping: Map<string, string>,
}) {
    const {
        xmlDoc,
        staticMapping,
    } = props;

    const images = xmlDoc.querySelectorAll('img');

    for (const image of images) {
        const src = image.getAttribute('src')?.replace(Directory.Documents, '');
        if (!src) {
            continue;
        }
        
        const cachedBlobUrl = staticMapping.get(src);

        if (cachedBlobUrl) {
            image.setAttribute('src', cachedBlobUrl);
            continue;
        }

        const fileReadResponse = await Filesystem.readFile({
            path: src,
            directory: Directory.Documents,
        });

        let staticFileContent = fileReadResponse.data;
        if (staticFileContent instanceof Blob) {
            staticFileContent = await staticFileContent.text();
        }

        const url = `data:image/jpeg;base64,${staticFileContent}`;
        const data = await (await fetch(url)).blob();

        const blobUrl = URL.createObjectURL(data);
        
        image.setAttribute('src', blobUrl);

        staticMapping.set(src, blobUrl);
    }
}