import type { BookAttributes } from 'src/types';

export async function retrieveBookAttributes(opfFileContent: string): Promise<BookAttributes> {
    const xmlDoc = new DOMParser().parseFromString(opfFileContent, 'text/xml');
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

        spine: {},
        addedAt: Date.now(),
    };

    // navigation
    const navigationEPUB2 = manifestNode.querySelector('item[media-type="application/x-dtbncx+xml"]');
    const navigationEPUB3 = manifestNode.querySelector('item[properties~="nav"]');

    if (navigationEPUB3) {
        bookAttributes.navigationEpub3Src = navigationEPUB3.getAttribute('href') ?? '';
    } else if (navigationEPUB2) {
        bookAttributes.navigationEpub2Src = navigationEPUB2.getAttribute('href') ?? '';
    }

    // spine
    const spine: Record<string, string> = {};
    const spineItems = spineNode.querySelectorAll('itemref');

    spineItems?.forEach((item) => {
        const idRef = item.getAttribute('idref');
        const manifestItem = manifestNode.querySelector(`#${idRef}`);
        const value = manifestItem?.getAttribute('href');

        if (idRef && value) {
            spine[idRef] = value;
        }
    });
    bookAttributes.spine = spine;

    // cover
    const cover = manifestNode.querySelector('#cover-image')?.getAttribute('href');
    if (cover) {
        bookAttributes.cover = cover;
    }
    
    return bookAttributes;
}
