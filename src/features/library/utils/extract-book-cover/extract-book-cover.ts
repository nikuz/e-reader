import { Capacitor } from '@capacitor/core';
import { FileStorageController, FILE_STORAGE_DEFAULT_DIRECTORY } from 'src/controllers';
import { pathUtils, converterUtils, imageUtils } from 'src/utils';
import type { BookAttributes } from 'src/types';

const HTML_CONTAINER_EXTENSIONS = new Set(['xhtml', 'html', 'htm']);

/**
 * Reads the book cover file from storage and returns it as an Object URL
 * so it can be rendered as an image source.
 */
export async function extractBookCover(book: BookAttributes): Promise<string | undefined> {
    if (!book.cover) {
        return;
    }

    const coverPath = pathUtils.join([book.dirname, book.cover]);
    const coverExtension = getFileExtension(book.cover);

    if (HTML_CONTAINER_EXTENSIONS.has(coverExtension)) {
        const htmlFileContent = await FileStorageController.readFile({ path: coverPath });
        const embeddedSrc = extractCoverSrc(htmlFileContent.data);
        if (!embeddedSrc) {
            return;
        }

        let imageFileContent: string;
        let fileName: string;

        if (embeddedSrc.startsWith('data:')) {
            imageFileContent = converterUtils.removeBase64Prefix(embeddedSrc);
            fileName = 'cover.jpg';
        } else {
            let resolvedImagePath = embeddedSrc;
            if (resolvedImagePath.startsWith(`/${FILE_STORAGE_DEFAULT_DIRECTORY}`)) {
                resolvedImagePath = resolvedImagePath.replace(`/${FILE_STORAGE_DEFAULT_DIRECTORY}`, '');
            }
            imageFileContent = (await FileStorageController.readFile({ path: resolvedImagePath })).data;
            const filePathParts = resolvedImagePath.split('/');
            fileName = filePathParts[filePathParts.length - 1];
        }
        
        if (!imageFileContent || !fileName) {
            return;
        }

        const newCoverPath = `${book.dirname}/${fileName}`;

        await FileStorageController.writeFile({
            path: newCoverPath,
            data: imageFileContent,
        });

        const fileUri = await FileStorageController.getUri({
            path: newCoverPath,
        });
        
        return Capacitor.convertFileSrc(fileUri.uri);
    } else {
        const coverFileContent = await FileStorageController.readFile({ path: coverPath });
        const filePathParts = book.cover.split('/');
        const fileName = filePathParts[filePathParts.length - 1];
        const newCoverPath = `${book.dirname}/${fileName}`;

        await FileStorageController.writeFile({
            path: newCoverPath,
            data: coverFileContent.data,
        });

        const fileUri = await FileStorageController.getUri({
            path: newCoverPath,
        });

        return Capacitor.convertFileSrc(fileUri.uri);
    }
};

function extractCoverSrc(markup: string): string | undefined {
    if (!markup.trim()) {
        return;
    }

    // Extract all image URLs from various patterns
    const urlsFound: string[] = imageUtils.extractSrcList(markup).filter(url => !shouldSkipUrl(url));

    if (urlsFound.length === 0) {
        return;
    }

    return urlsFound[0];
}

function getFileExtension(path: string, fallback = 'png'): string {
    const sanitized = path.split('?')[0].split('#')[0];
    const match = sanitized.match(/\.([^./]+)$/);

    return match ? match[1].toLowerCase() : fallback;
}

// Helper to check if URL should be skipped
function shouldSkipUrl(url: string): boolean {
    return !url ||
        url.startsWith('http://') ||
        url.startsWith('https://') ||
        url.startsWith('//');
}