import { FileStorageController, FileStorageEncoding } from 'src/controllers';
import { pathUtils } from 'src/utils';
import type {
    BookAttributes,
    BookNavigationEpub2,
    BookNavigationEpub2NavPoint,
} from 'src/types';

export async function retrieveNavigationEpub2(book: BookAttributes): Promise<BookNavigationEpub2> {
    if (!book.navigationEpub2Src) {
        throw new Error('Book navigation source is missing');
    }

    const navigationPath = pathUtils.join([book.dirname, book.navigationEpub2Src]);
    
    const tocContent = await FileStorageController.readFile({
        path: navigationPath,
        encoding: FileStorageEncoding.UTF8,
    });
    
    if (typeof tocContent.data !== 'string') {
        throw new Error('Unable to read EPUB2 navigation file');
    }

    const xmlDoc = new DOMParser().parseFromString(tocContent.data, 'application/xhtml+xml');
    const navMapNode = xmlDoc.querySelector('navMap');

    if (!navMapNode) {
        throw new Error('EPUB2 navigation file does not contain navMap');
    }

    const navPoints = collectNavPoints(navMapNode);

    return { navMap: navPoints };
}

function collectNavPoints(container: Element): BookNavigationEpub2NavPoint[] {
    const navPointElements = container.querySelectorAll(':scope > navPoint');
    const navPoints: BookNavigationEpub2NavPoint[] = [];

    for (const navPointElement of navPointElements) {
        const navPoint = createNavPoint(navPointElement);
        if (navPoint) {
            navPoints.push(navPoint);
        }
    }

    return navPoints;
}

function createNavPoint(navPointElement: Element): BookNavigationEpub2NavPoint | undefined {
    const text = navPointElement.querySelector('navLabel > text')?.textContent?.trim();
    const srcAttribute = navPointElement.querySelector('content')?.getAttribute('src');

    if (!text || !srcAttribute) {
        return undefined;
    }

    const children = collectNavPoints(navPointElement);

    return {
        text,
        src: srcAttribute,
        children,
    };
}
