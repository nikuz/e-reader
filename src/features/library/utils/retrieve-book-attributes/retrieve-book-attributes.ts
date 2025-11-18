import type { BookAttributes, BookChapter } from 'src/types';

export async function retrieveBookAttributes(opfFileContent: string, opfDir: string): Promise<BookAttributes> {
    const xmlDoc = new DOMParser().parseFromString(opfFileContent, 'application/xhtml+xml');
    const metadataNode = xmlDoc.querySelector('metadata');
    const manifestNode = xmlDoc.querySelector('manifest');
    const spineNode = xmlDoc.querySelector('spine');

    if (!metadataNode || !manifestNode || !spineNode) {
        throw new Error('OPF should contain "metadata", "manifest", and "spine" nodes');
    }

    const bookAttributes: BookAttributes = {
        eisbn: metadataNode.querySelector('#eisbn')?.textContent ?? '',
        title: metadataNode.getElementsByTagName('dc:title')[0]?.textContent ?? '',
        author: metadataNode.getElementsByTagName('dc:creator')[0]?.textContent ?? '',
        language: metadataNode.getElementsByTagName('dc:language')[0].textContent ?? '',
        dirname: '',

        spine: [],
        highlights: [],
        createdAt: Date.now(),
    };

    // navigation
    const navigationEPUB2 = manifestNode.querySelector('item[media-type="application/x-dtbncx+xml"]');
    const navigationEPUB3 = manifestNode.querySelector('item[properties~="nav"]');

    if (navigationEPUB3) {
        bookAttributes.navigationEpub3Src = prependBaseDir(navigationEPUB3.getAttribute('href'), opfDir);
    } else if (navigationEPUB2) {
        bookAttributes.navigationEpub2Src = prependBaseDir(navigationEPUB2.getAttribute('href'), opfDir);
    }

    // spine
    const spine: BookChapter[] = [];
    const spineItems = spineNode.querySelectorAll('itemref');

    spineItems?.forEach((item) => {
        const idRef = item.getAttribute('idref');
        const manifestItem = manifestNode.querySelector(`#${idRef}`);
        const value = manifestItem?.getAttribute('href');

        if (idRef && value) {
            spine.push({
                filePath: prependBaseDir(value, opfDir),
            });
        }
    });
    bookAttributes.spine = spine;

    // cover (EPUB 2 & 3)
    const coverIdFromMeta = metadataNode.querySelector('meta[name="cover"]')?.getAttribute('content')?.trim();
    
    let coverHref: string | undefined;
    
    if (coverIdFromMeta) {
        if (coverIdFromMeta.indexOf('/') !== -1 || coverIdFromMeta.indexOf('.') !== -1) {
            coverHref = coverIdFromMeta;
        } else {
            coverHref = manifestNode.querySelector(`#${coverIdFromMeta}`)?.getAttribute('href') ?? undefined;
        }
    }

    if (!coverHref) {
        coverHref = manifestNode.querySelector('item[properties~="cover-image"]')?.getAttribute('href') ?? undefined;
    }

    if (!coverHref) {
        coverHref = manifestNode.querySelector('#cover-image, #cover')?.getAttribute('href') ?? undefined;
    }

    if (coverHref) {
        bookAttributes.cover = prependBaseDir(coverHref, opfDir);
    }

    return bookAttributes;
}

function prependBaseDir(value: string | null, opfDir: string): string {
    if (!value) {
        return '';
    }

    const baseDir = opfDir ? `${opfDir}/` : '';

    return `${baseDir}${value}`;
}