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

    const navigationBasePath = book.navigationEpub2Src.slice(0, book.navigationEpub2Src.lastIndexOf('/'));
    const navPoints = collectNavPoints(navMapNode, navigationBasePath);

    return { navMap: navPoints };
}

function collectNavPoints(container: Element, basePath: string): BookNavigationEpub2NavPoint[] {
    const navPointElements = container.querySelectorAll('navPoint');
    const navPoints: BookNavigationEpub2NavPoint[] = [];

    for (const navPointElement of navPointElements) {
        const navPoint = createNavPoint(navPointElement, basePath);
        if (navPoint) {
            navPoints.push(navPoint);
        }
    }

    return navPoints;
}

function createNavPoint(
    navPointElement: Element,
    basePath: string,
): BookNavigationEpub2NavPoint | undefined {
    const text = navPointElement.querySelector('navLabel > text')?.textContent?.trim();
    const srcAttribute = navPointElement.querySelector('content')?.getAttribute('src');

    if (!text || !srcAttribute) {
        return undefined;
    }

    const resolvedSrc = pathUtils.join([basePath, srcAttribute]);
    const children = collectNavPoints(navPointElement, basePath);

    return {
        text,
        src: resolvedSrc,
        children,
    };
}
