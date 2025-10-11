import { FileStorageController, FILE_STORAGE_DEFAULT_DIRECTORY } from 'src/controllers';
import { pathUtils } from 'src/utils';
import type { BookAttributes } from '../../types';

const HTML_CONTAINER_EXTENSIONS = new Set(['xhtml', 'html', 'htm']);

/**
 * Reads the book cover file from storage and returns it as an Object URL
 * so it can be rendered as an image source.
 */
export async function getBookCoverObjectUrl(book: BookAttributes): Promise<string | undefined> {
    if (!book.cover) {
        return undefined;
    }

    const coverPath = pathUtils.join([book.dirname, book.cover]);
    const coverFileContent = await FileStorageController.readFile({ path: coverPath });
    const coverExtension = getFileExtension(book.cover);

    if (HTML_CONTAINER_EXTENSIONS.has(coverExtension)) {
        const embeddedSrc = extractCoverSrc(coverFileContent.data);
        if (!embeddedSrc) {
            return undefined;
        }

        if (embeddedSrc.startsWith('data:')) {
            const inlineBlob = await (await fetch(embeddedSrc)).blob();
            return URL.createObjectURL(inlineBlob);
        }

        let resolvedImagePath = embeddedSrc;
        if (resolvedImagePath.startsWith(`/${FILE_STORAGE_DEFAULT_DIRECTORY}`)) {
            resolvedImagePath = resolvedImagePath.replace(`/${FILE_STORAGE_DEFAULT_DIRECTORY}`, '');
        }
        
        const imageFileContent = await FileStorageController.readFile({ path: resolvedImagePath });

        const extension = getFileExtension(embeddedSrc);
        return createObjectUrlFromBase64(imageFileContent.data, extension);
    }

    return createObjectUrlFromBase64(coverFileContent.data, coverExtension);
};

function extractCoverSrc(markup: string): string | undefined {
    if (!markup.trim()) {
        return;
    }

    const imageRegexp = /<img.+?src=["']([^"']+)["'].*?>/gi;
    const images = markup.match(imageRegexp);
    
    if (!images) {
        return;
    }

    return images[0].replace(imageRegexp, '$1');
}

function getFileExtension(path: string, fallback = 'png'): string {
    const sanitized = path.split('?')[0].split('#')[0];
    const match = sanitized.match(/\.([^./]+)$/);

    return match ? match[1].toLowerCase() : fallback;
}

async function createObjectUrlFromBase64(base64: string, extension: string): Promise<string | undefined> {
    const cleaned = base64.trim();

    if (!cleaned) {
        return undefined;
    }

    const dataUrl = `data:image/${extension.toLowerCase()};base64,${cleaned}`;
    const blob = await (await fetch(dataUrl)).blob();

    return URL.createObjectURL(blob);
}