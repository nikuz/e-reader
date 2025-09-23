export async function retrieveStaticContent(props: {
    xmlDoc: Document,
    chapterDirname: string,
    staticMapping: Map<string, string>,
}) {
    const { 
        xmlDoc,
        chapterDirname,
        staticMapping,
    } = props;

    await Promise.all([
        retrieveStyles({
            xmlDoc,
            chapterDirname,
            staticMapping,
        }),
        retrieveImages({
            xmlDoc,
            chapterDirname,
            staticMapping,
        }),
    ]);
}

async function retrieveStyles(props: {
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
        const staticSrc = `${chapterDirname}/${href}`;
        const cachedBlobUrl = staticMapping.get(staticSrc);

        if (cachedBlobUrl) {
            link.setAttribute('href', cachedBlobUrl);
            continue;
        }

        const response = await fetch(staticSrc);
        if (!response.ok) {
            continue;
        }

        let content = await response.text();
        const urls = content.match(cssUrlRegexp);
        const staticSrcDirname = staticSrc.slice(0, staticSrc.lastIndexOf('/'));

        if (urls) {
            for (const url of urls) {
                const urlValue = url.replace(cssUrlRegexp, '$1');
                const urlSrc = `${staticSrcDirname}/${urlValue}`;
                const cachedBlobUrl = staticMapping.get(urlSrc);
                if (cachedBlobUrl) {
                    content = content.replace(urlValue, cachedBlobUrl);
                    continue;
                }

                const response = await fetch(urlSrc);
                if (!response.ok) {
                    continue;
                }

                const urlContent = await response.blob();
                const blobUrl = URL.createObjectURL(urlContent);

                content = content.replace(urlValue, blobUrl);

                staticMapping.set(staticSrc, blobUrl);
            }
        }

        const blob = new Blob([content], { type: 'text/css' });
        const blobUrl = URL.createObjectURL(blob);

        link.setAttribute('href', blobUrl);

        staticMapping.set(staticSrc, blobUrl);
    }
}

async function retrieveImages(props: {
    xmlDoc: Document,
    chapterDirname: string,
    staticMapping: Map<string, string>,
}) {
    const {
        xmlDoc,
        chapterDirname,
        staticMapping,
    } = props;

    const images = xmlDoc.querySelectorAll('img');

    for (const image of images) {
        const src = image.getAttribute('src');
        const staticSrc = `${chapterDirname}/${src}`;
        const cachedBlobUrl = staticMapping.get(staticSrc);

        if (cachedBlobUrl) {
            image.setAttribute('src', cachedBlobUrl);
            continue;
        }

        const response = await fetch(staticSrc);
        if (!response.ok) {
            continue;
        }

        const content = await response.blob();
        const blobUrl = URL.createObjectURL(content);

        image.setAttribute('src', blobUrl);

        staticMapping.set(staticSrc, blobUrl);
    }
}