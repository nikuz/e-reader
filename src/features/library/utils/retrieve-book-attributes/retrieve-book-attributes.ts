import type { BookAttributes } from 'src/types';

export async function retrieveBookAttributes(opfFileContent: string): Promise<BookAttributes> {
    const xmlDoc = new DOMParser().parseFromString(opfFileContent, 'text/xml');
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
    const title = metadataNode.getElementsByTagName('dc:title')[0];
    const author = metadataNode.getElementsByTagName('dc:creator')[0];
    const language = metadataNode.getElementsByTagName('dc:language')[0];
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

    return {
        eisbn: eisbn?.textContent ?? '',
        title: title?.textContent ?? '',
        author: author?.textContent ?? '',
        language: language?.textContent ?? '',
        navigation: navigation?.getAttribute('href') ?? '',
        dirname: '',

        spine,
    };
}