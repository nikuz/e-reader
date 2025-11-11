import { Capacitor } from '@capacitor/core';
import { FileStorageController, FILE_STORAGE_DEFAULT_DIRECTORY } from 'src/controllers';
import { pathUtils } from 'src/utils';

// Regular expressions for different image embedding patterns
const patterns = {
    // <img src="...">
    imgSrc: /<img([^>]+)src=["']([^"']+)["']([^>]*)>/gi,
    // <img srcset="url1 1x, url2 2x, ...">
    imgSrcset: /<img([^>]+)srcset=["']([^"']+)["']([^>]*)>/gi,
    // SVG <image xlink:href="...">
    svgImageXlinkHref: /<image([^>]+)xlink:href=["']([^"']+)["']([^>]*)>/gi,
    // SVG <image href="...">
    svgImageHref: /<image([^>]+)href=["']([^"']+)["']([^>]*)>/gi,
    // <object data="...">
    objectData: /<object([^>]+)data=["']([^"']+)["']([^>]*)>/gi,
    // <embed src="...">
    embedSrc: /<embed([^>]+)src=["']([^"']+)["']([^>]*)>/gi,
    // <input type="image" src="...">
    inputImageSrc: /<input([^>]+)type=["']image["']([^>]+)src=["']([^"']+)["']([^>]*)>/gi,
    // <source srcset="..."> (inside <picture>)
    sourceSrcset: /<source([^>]+)srcset=["']([^"']+)["']([^>]*)>/gi,
    // CSS background-image: url(...) in style attributes
    cssBackgroundUrl: /style=["']([^"']*background-image:\s*url\(['"]?)([^'")\s]+)(['"]?\)[^"']*)["']/gi,
};

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
    const urlsFound: string[] = [];

    // 1. <img src="...">
    const imgSrcMatches = [...fileContent.matchAll(patterns.imgSrc)];
    for (const match of imgSrcMatches) {
        urlsFound.push(match[2]);
    }

    // 2. <img srcset="...">
    const imgSrcsetMatches = [...fileContent.matchAll(patterns.imgSrcset)];
    for (const match of imgSrcsetMatches) {
        urlsFound.push(...extractUrlsFromSrcset(match[2]));
    }

    // 3. SVG <image xlink:href="...">
    const svgXlinkMatches = [...fileContent.matchAll(patterns.svgImageXlinkHref)];
    for (const match of svgXlinkMatches) {
        urlsFound.push(match[2]);
    }

    // 4. SVG <image href="...">
    const svgHrefMatches = [...fileContent.matchAll(patterns.svgImageHref)];
    for (const match of svgHrefMatches) {
        urlsFound.push(match[2]);
    }

    // 5. <object data="...">
    const objectDataMatches = [...fileContent.matchAll(patterns.objectData)];
    for (const match of objectDataMatches) {
        urlsFound.push(match[2]);
    }

    // 6. <embed src="...">
    const embedSrcMatches = [...fileContent.matchAll(patterns.embedSrc)];
    for (const match of embedSrcMatches) {
        urlsFound.push(match[2]);
    }

    // 7. <input type="image" src="...">
    const inputImageMatches = [...fileContent.matchAll(patterns.inputImageSrc)];
    for (const match of inputImageMatches) {
        urlsFound.push(match[3]);
    }

    // 8. <source srcset="...">
    const sourceSrcsetMatches = [...fileContent.matchAll(patterns.sourceSrcset)];
    for (const match of sourceSrcsetMatches) {
        urlsFound.push(...extractUrlsFromSrcset(match[2]));
    }

    // 9. CSS background-image: url(...)
    const cssBackgroundMatches = [...fileContent.matchAll(patterns.cssBackgroundUrl)];
    for (const match of cssBackgroundMatches) {
        urlsFound.push(match[2]);
    }

    // Remove duplicates and filter out URLs that should be skipped
    const uniqueUrls = [...new Set(urlsFound)].filter(url => !shouldSkipUrl(url));

    if (uniqueUrls.length === 0) {
        return fileContent;
    }

    // Get replacement URLs for all unique URLs
    for (const url of uniqueUrls) {
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


// Helper to extract URLs from srcset attribute (format: "url1 1x, url2 2x, url3 600w")
function extractUrlsFromSrcset(srcset: string): string[] {
    return srcset
        .split(',')
        .map(entry => entry.trim().split(/\s+/)[0])
        .filter(url => url && !url.startsWith('data:'));
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