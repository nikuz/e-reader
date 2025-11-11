import { Capacitor } from '@capacitor/core';
import {
    FileStorageController,
    FileStorageEncoding,
    type FileStorageReadFileResult,
    FILE_STORAGE_DEFAULT_DIRECTORY,
} from 'src/controllers';
import { pathUtils } from 'src/utils';

// Regular expressions for different stylesheet embedding patterns
const patterns = {
    // <link rel="stylesheet" href="...">
    linkHref: /<link([^>]+)href=["']([^"']+)["']([^>]*)>/gi,
    // <?xml-stylesheet href="..."?>
    xmlStylesheet: /<\?xml-stylesheet([^?]+)href=["']([^"']+)["']([^?]*)\?>/gi,
    // @import in inline <style> tags
    styleTagImport: /<style[^>]*>([\s\S]*?)<\/style>/gi,
    // url() in CSS (handles url(), url("..."), url('...'), url( ... ))
    cssUrl: /url\s*\(\s*(['"]?)([^'")\s]+)\1\s*\)/gi,
    // @import in CSS
    cssImport: /@import\s+(['"])([^'"]+)\1/gi,
};

export async function replaceStyleUrls(props: {
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
    const stylesheetHrefs: string[] = [];

    // 1. Extract <link href="..."> references
    const linkMatches = [...fileContent.matchAll(patterns.linkHref)];
    for (const match of linkMatches) {
        const href = match[2];
        if (!shouldSkipUrl(href)) {
            stylesheetHrefs.push(href);
        }
    }

    // 2. Extract <?xml-stylesheet href="..."?> references (common in EPUB)
    const xmlStylesheetMatches = [...fileContent.matchAll(patterns.xmlStylesheet)];
    for (const match of xmlStylesheetMatches) {
        const href = match[2];
        if (!shouldSkipUrl(href)) {
            stylesheetHrefs.push(href);
        }
    }

    // 3. Process inline <style> tags for @import rules
    const styleTagMatches = [...fileContent.matchAll(patterns.styleTagImport)];
    for (const match of styleTagMatches) {
        const styleContent = match[1];
        const importMatches = [...styleContent.matchAll(patterns.cssImport)];

        for (const importMatch of importMatches) {
            const href = importMatch[2];
            if (!shouldSkipUrl(href)) {
                stylesheetHrefs.push(href);
            }
        }
    }

    // Remove duplicates
    const uniqueStylesheetHrefs = [...new Set(stylesheetHrefs)];

    // Process each stylesheet file
    for (const href of uniqueStylesheetHrefs) {
        try {
            const styleSrc = pathUtils.join([chapterDirname, href]);

            // Check if already processed
            const cachedStyleUrl = staticMapping.get(href);
            if (cachedStyleUrl) {
                modifiedFileContent = modifiedFileContent.split(href).join(cachedStyleUrl);
                continue;
            }

            // Read the stylesheet file
            let fileReadResponse: FileStorageReadFileResult;
            try {
                fileReadResponse = await FileStorageController.readFile({
                    path: styleSrc,
                    encoding: FileStorageEncoding.UTF8,
                });
            } catch {
                continue;
            }

            // Process CSS content to replace internal URLs
            const styleSrcDirname = styleSrc.slice(0, styleSrc.lastIndexOf('/'));
            const modifiedStyleContent = await processCssContent(
                fileReadResponse.data,
                styleSrcDirname,
                staticMapping,
            );

            // Write modified CSS back if it changed
            if (modifiedStyleContent !== fileReadResponse.data) {
                await FileStorageController.writeFile({
                    path: styleSrc,
                    data: modifiedStyleContent,
                    encoding: FileStorageEncoding.UTF8,
                });
            }

            // Replace the stylesheet reference in the HTML
            const styleSrcUri = await FileStorageController.getUri({ path: styleSrc });
            const styleFileUri = Capacitor.convertFileSrc(styleSrcUri.uri);
            staticMapping.set(href, styleFileUri);
            modifiedFileContent = modifiedFileContent.split(href).join(styleFileUri);
        } catch (error) {
            console.warn(`Failed to process stylesheet: ${href}`, error);
        }
    }

    // 4. Process inline <style> tag content for url() references
    for (const match of styleTagMatches) {
        const originalStyleTag = match[0];
        const styleContent = match[1];

        try {
            const modifiedStyleContent = await processCssContent(
                styleContent,
                chapterDirname,
                staticMapping,
            );

            if (modifiedStyleContent !== styleContent) {
                const modifiedStyleTag = originalStyleTag.replace(styleContent, modifiedStyleContent);
                modifiedFileContent = modifiedFileContent.replace(originalStyleTag, modifiedStyleTag);
            }
        } catch (error) {
            console.warn('Failed to process inline style tag', error);
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

// Helper to process CSS content and replace URLs within it
async function processCssContent(
    cssContent: string,
    cssFileDirname: string,
    staticMapping: Map<string, string>,
): Promise<string> {
    let modifiedCssContent = cssContent;
    const urlsToReplace = new Map<string, string>();

    // Extract all url() references
    const urlMatches = [...cssContent.matchAll(patterns.cssUrl)];
    for (const match of urlMatches) {
        const url = match[2];
        if (!shouldSkipUrl(url) && !urlsToReplace.has(url)) {
            try {
                const replacementUrl = await getReplacementUrl(url, cssFileDirname, staticMapping);
                urlsToReplace.set(url, replacementUrl);
            } catch (error) {
                console.warn(`Failed to replace CSS url: ${url}`, error);
            }
        }
    }

    // Extract all @import references
    const importMatches = [...cssContent.matchAll(patterns.cssImport)];
    for (const match of importMatches) {
        const url = match[2];
        if (!shouldSkipUrl(url) && !urlsToReplace.has(url)) {
            try {
                const replacementUrl = await getReplacementUrl(url, cssFileDirname, staticMapping);
                urlsToReplace.set(url, replacementUrl);
            } catch (error) {
                console.warn(`Failed to replace CSS @import: ${url}`, error);
            }
        }
    }

    // Replace all URLs, sorted by length to avoid partial replacements
    const sortedUrls = Array.from(urlsToReplace.keys()).sort((a, b) => b.length - a.length);
    for (const originalUrl of sortedUrls) {
        const replacementUrl = urlsToReplace.get(originalUrl);
        if (replacementUrl) {
            modifiedCssContent = modifiedCssContent.split(originalUrl).join(replacementUrl);
        }
    }

    return modifiedCssContent;
}

// Helper to get replacement URL for a given path
async function getReplacementUrl(
    url: string,
    baseDirname: string,
    staticMapping: Map<string, string>,
): Promise<string> {
    const cachedUrl = staticMapping.get(url);
    if (cachedUrl) {
        return cachedUrl;
    }

    const fullPath = pathUtils.join([baseDirname, url]);
    const fileUri = await FileStorageController.getUri({ path: fullPath });
    const convertedUri = Capacitor.convertFileSrc(fileUri.uri);

    staticMapping.set(url, convertedUri);
    return convertedUri;
}