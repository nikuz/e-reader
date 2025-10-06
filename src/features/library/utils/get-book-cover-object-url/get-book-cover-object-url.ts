import { FileStorageController } from 'src/controllers';
import { pathUtils } from 'src/utils';
import type { BookAttributes } from 'src/types';

/**
 * Reads the book cover file from storage and returns it as an Object URL
 * so it can be rendered as an image source.
 */
export async function getBookCoverObjectUrl(book: BookAttributes): Promise<string | undefined> {
    if (!book.cover) {
        return undefined;
    }

    const fileReadResponse = await FileStorageController.readFile({
        path: pathUtils.join([book.dirname, book.cover]),
    });

    let staticFileContent = fileReadResponse.data;
    if (staticFileContent instanceof Blob) {
        staticFileContent = await staticFileContent.text();
    }

    const extensionMatch = book.cover.match(/\.([^.]+)$/);
    const extension = extensionMatch ? extensionMatch[1] : 'png';

    const dataUrl = `data:image/${extension};base64,${staticFileContent}`;
    const blob = await (await fetch(dataUrl)).blob();

    return URL.createObjectURL(blob);
};
