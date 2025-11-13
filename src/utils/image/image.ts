export const imageRegex = /\.(jpg|jpeg|png|gif|bmp|svg|webp|ico)$/i;

// Regular expressions for different image embedding patterns
export const imagePatterns = {
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

export function isImage(filePath: string) {
    return imageRegex.test(filePath);
}

// Helper to extract URLs from srcset attribute (format: "url1 1x, url2 2x, url3 600w")
export function extractUrlsFromSrcset(srcset: string): string[] {
    return srcset
        .split(',')
        .map(entry => entry.trim().split(/\s+/)[0])
        .filter(url => url && !url.startsWith('data:'));
}

export function extractSrcList(content: string): string[] {
    if (!content.trim()) {
        return [];
    }

    // Extract all image URLs from various patterns
    const urlsFound: string[] = [];

    // 1. <img src="...">
    const imgSrcMatches = [...content.matchAll(imagePatterns.imgSrc)];
    for (const match of imgSrcMatches) {
        urlsFound.push(match[2]);
    }

    // 2. <img srcset="...">
    const imgSrcsetMatches = [...content.matchAll(imagePatterns.imgSrcset)];
    for (const match of imgSrcsetMatches) {
        urlsFound.push(...extractUrlsFromSrcset(match[2]));
    }

    // 3. SVG <image xlink:href="...">
    const svgXlinkMatches = [...content.matchAll(imagePatterns.svgImageXlinkHref)];
    for (const match of svgXlinkMatches) {
        urlsFound.push(match[2]);
    }

    // 4. SVG <image href="...">
    const svgHrefMatches = [...content.matchAll(imagePatterns.svgImageHref)];
    for (const match of svgHrefMatches) {
        urlsFound.push(match[2]);
    }

    // 5. <object data="...">
    const objectDataMatches = [...content.matchAll(imagePatterns.objectData)];
    for (const match of objectDataMatches) {
        urlsFound.push(match[2]);
    }

    // 6. <embed src="...">
    const embedSrcMatches = [...content.matchAll(imagePatterns.embedSrc)];
    for (const match of embedSrcMatches) {
        urlsFound.push(match[2]);
    }

    // 7. <input type="image" src="...">
    const inputImageMatches = [...content.matchAll(imagePatterns.inputImageSrc)];
    for (const match of inputImageMatches) {
        urlsFound.push(match[3]);
    }

    // 8. <source srcset="...">
    const sourceSrcsetMatches = [...content.matchAll(imagePatterns.sourceSrcset)];
    for (const match of sourceSrcsetMatches) {
        urlsFound.push(...extractUrlsFromSrcset(match[2]));
    }

    // 9. CSS background-image: url(...)
    const cssBackgroundMatches = [...content.matchAll(imagePatterns.cssBackgroundUrl)];
    for (const match of cssBackgroundMatches) {
        urlsFound.push(match[2]);
    }

    return [...new Set(urlsFound)];
}