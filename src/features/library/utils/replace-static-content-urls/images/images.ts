import { Capacitor } from '@capacitor/core';
import { FileStorageController, FILE_STORAGE_DEFAULT_DIRECTORY } from 'src/controllers';
import { pathUtils, imageUtils } from 'src/utils';

export async function replaceImageUrls(props: {
    fileContent: string,
    chapterDirname: string,
    staticMapping: Map<string, string>,
}): Promise<string> {
    const {
        fileContent,
        chapterDirname,
        staticMapping,
    } = props;

    let modifiedFileContent = fileContent;
    const urlsToReplace = new Map<string, string>(); // original URL -> replacement URL

    // Extract all image URLs from various patterns
    const urlsFound: string[] = imageUtils.extractSrcList(fileContent).filter(url => !shouldSkipUrl(url));

    if (urlsFound.length === 0) {
        return fileContent;
    }

    // Get replacement URLs for all unique URLs
    for (const url of urlsFound) {
        try {
            const replacementUrl = await replaceUrl(url, chapterDirname, staticMapping);
            urlsToReplace.set(url, replacementUrl);
        } catch (error) {
            // If a file doesn't exist, skip it
            console.warn(`Failed to replace URL: ${url}`, error);
        }
    }

    // Replace all URLs in the content
    // Sort by length (descending) to replace longer URLs first and avoid partial replacements
    const sortedUrls = Array.from(urlsToReplace.keys()).sort((a, b) => b.length - a.length);

    for (const originalUrl of sortedUrls) {
        const replacementUrl = urlsToReplace.get(originalUrl);
        if (replacementUrl) {
            // Use a more precise replacement to avoid replacing parts of other URLs
            modifiedFileContent = modifiedFileContent.split(originalUrl).join(replacementUrl);
        }
    }

    return modifiedFileContent;
}


// Helper to check if URL should be skipped
function shouldSkipUrl(url: string): boolean {
    return !url ||
        url.startsWith(`/${FILE_STORAGE_DEFAULT_DIRECTORY}`) ||
        url.startsWith('data:') ||
        url.startsWith('http://') ||
        url.startsWith('https://') ||
        url.startsWith('//');
}

// Helper to replace URL in content
async function replaceUrl(
    url: string,
    chapterDirname: string,
    staticMapping: Map<string, string>,
): Promise<string> {
    const cachedImageUrl = staticMapping.get(url);
    if (cachedImageUrl) {
        return cachedImageUrl;
    }

    const staticSrc = pathUtils.join([chapterDirname, url]);
    const fileUri = await FileStorageController.getUri({
        path: staticSrc,
    });
    const imageFileUri = Capacitor.convertFileSrc(fileUri.uri);

    staticMapping.set(url, imageFileUri);
    return imageFileUri;
}