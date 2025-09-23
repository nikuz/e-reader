import type { BookAttributes } from '../../types';

export async function retrieveBookAttributes(src: string): Promise<BookAttributes> {
    if (!src.endsWith('opf')) {
        throw new Error('SRC should point to an OPF file');
    }

    const response = await fetch(src);

    if (!response.ok) {
        throw new Error('Can\'t load OPF file');
    }

    const content = await response.text();

    const xmlDoc = new DOMParser().parseFromString(content, 'text/xml');
    const metadataNode = xmlDoc.querySelector('metadata');
    const manifestNode = xmlDoc.querySelector('manifest');
    const spineNode = xmlDoc.querySelector('spine');

    if (!metadataNode || !manifestNode || !spineNode) {
        throw new Error('OPF should contain "metadata", "manifest", and "spine" nodes');
    }

    const navigation = manifestNode.querySelector('item[properties="nav"]');

    if (!navigation) {
        throw new Error('OPF manifest doesn\'t contain navigation');
    }

    const eisbn = metadataNode.querySelector('#eisbn');
    const creator = metadataNode.getElementsByTagName('dc:creator')[0];
    const language = metadataNode.getElementsByTagName('dc:language')[0];
    const spine = new Map();

    const spineItems = spineNode.querySelectorAll('itemref');

    spineItems?.forEach((item) => {
        const idRef = item.getAttribute('idref');
        const manifestItem = manifestNode.querySelector(`#${idRef}`);
        const value = manifestItem?.getAttribute('href');

        if (value) {
            spine.set(idRef, value);
        }
    });

    const lastSlashIndex = src.lastIndexOf('/');

    return {
        eisbn: eisbn?.textContent ?? '',
        creator: creator?.textContent ?? '',
        language: language?.textContent ?? '',
        navigation: navigation?.getAttribute('href') ?? '',
        dirname: src.substring(0, lastSlashIndex),

        spine,
    };
}