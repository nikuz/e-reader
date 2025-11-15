import {
    FileStorageController,
    FILE_STORAGE_DEFAULT_DIRECTORY,
} from 'src/controllers';
import { converterUtils } from 'src/utils';
import type { BookAttributes } from 'src/types';
import { MIME_TYPES } from './constants';

interface FileMapping {
    content: string;
    blobUrl?: string;
}

export async function webRetrieveStaticContent(props: {
    fileContent: string,
    book: BookAttributes,
    globalFileMapping: Map<string, FileMapping>,
}): Promise<string> {
    const { fileContent, book, globalFileMapping } = props;

    // Map of file path -> file metadata (content and blob URL)
    const localFileMapping = new Map<string, FileMapping>();

    // Step 1: Extract all absolute storage URLs from the HTML content
    const extractedUrls = extractStorageUrls(fileContent, book.dirname);

    if (extractedUrls.size === 0) {
        return fileContent;
    }

    // Step 2: Process each URL and build the file mapping
    await processUrls({
        extractedUrls,
        globalFileMapping,
        localFileMapping,
        book,
    });

    // Step 3: Create blob object URLs for all files
    await createBlobUrlsForImagesAndFonts(localFileMapping);

    // Step 4: Replace URLs in all file contents
    replaceUrlsInCssFiles(localFileMapping);

    for (const key of localFileMapping.keys()) {
        const localMappingValue = localFileMapping.get(key);
        if (!globalFileMapping.has(key) && localMappingValue) {
            globalFileMapping.set(key, localMappingValue);
        }
    }

    // Step 5: Replace URLs in the original HTML content
    return replaceUrls(fileContent, localFileMapping);
}

// Extract all storage URLs from content
function extractStorageUrls(content: string, bookDirname: string): Set<string> {
    const urls = new Set<string>();
    const storagePrefix = `/${FILE_STORAGE_DEFAULT_DIRECTORY}/${bookDirname}`;

    // Match URLs in quotes (href="...", src="...")
    const quotedUrlRegExp = new RegExp(`['"(]((${storagePrefix}[^'"]+?))['")]`, 'g');
    const matches = content.matchAll(quotedUrlRegExp);

    for (const match of matches) {
        const url = match[1];
        if (url) {
            urls.add(url);
        }
    }

    return urls;
}

// Process URLs and build file mapping, including CSS files
async function processUrls(props: {
    extractedUrls: Set<string>,
    globalFileMapping: Map<string, FileMapping>,
    localFileMapping: Map<string, FileMapping>,
    book: BookAttributes,
}): Promise<void> {
    const { extractedUrls, globalFileMapping, localFileMapping, book } = props;
    const urlsToProcess = Array.from(extractedUrls);

    while (urlsToProcess.length > 0) {
        const url = urlsToProcess.shift()!;

        if (globalFileMapping.has(url)) {
            const globalMappingValue = globalFileMapping.get(url);
            if (!localFileMapping.has(url) && globalMappingValue) {
                localFileMapping.set(url, globalMappingValue);
            }
            continue;
        }

        try {
            // Read the file content
            const fileReadResponse = await FileStorageController.readFile({
                path: url.replace(`/${FILE_STORAGE_DEFAULT_DIRECTORY}`, ''),
            });

            const content = fileReadResponse.data;
            localFileMapping.set(url, { content });

            // If it's a CSS file, extract URLs from it
            if (url.toLowerCase().endsWith('.css')) {
                const cssUrls = extractStorageUrls(content, book.dirname);

                // Add new URLs to the processing queue
                for (const cssUrl of cssUrls) {
                    if (!globalFileMapping.has(cssUrl)) {
                        urlsToProcess.push(cssUrl);
                    }
                }
            }
        } catch (error) {
            console.warn(`Failed to read file: ${url}`, error);
        }
    }
}

// Get MIME type from file extension
function getMimeType(url: string): string {
    const extension = url.substring(url.lastIndexOf('.')).toLowerCase();
    return MIME_TYPES[extension] || 'application/octet-stream';
}

// Create blob object URLs for all files
async function createBlobUrlsForImagesAndFonts(localFileMapping: Map<string, FileMapping>): Promise<void> {
    for (const [url, fileData] of localFileMapping.entries()) {
        const mimeType = getMimeType(url);
        if (fileData.blobUrl || (!mimeType.startsWith('image') && !mimeType.startsWith('font'))) {
            continue;
        }
        try {
            const blob = converterUtils.base64ToBlob(fileData.content, mimeType);;
            localFileMapping.set(url, {
                ...fileData,
                blobUrl: URL.createObjectURL(blob),
            });
        } catch (error) {
            console.warn(`Failed to create blob URL for: ${url}`, error);
        }
    }
}

// Replace URLs in all file contents
function replaceUrlsInCssFiles(localFileMapping: Map<string, FileMapping>): void {
    for (const [url, fileData] of localFileMapping.entries()) {
        const mimeType = getMimeType(url);
        if (fileData.blobUrl || mimeType !== 'text/css') {
            continue;
        }
        const modifiedContent = replaceUrls(fileData.content, localFileMapping);
        const blob = new Blob([modifiedContent], { type: mimeType });
        localFileMapping.set(url, {
            blobUrl: URL.createObjectURL(blob),
            content: modifiedContent,
        });
    }
}

// Replace URLs in content with blob URLs
function replaceUrls(content: string, localFileMapping: Map<string, FileMapping>): string {
    let modifiedContent = content;

    // Sort URLs by length (descending) to avoid partial replacements
    const sortedUrls = Array.from(localFileMapping.keys()).sort((a, b) => b.length - a.length);
    
    for (const originalUrl of sortedUrls) {
        const fileData = localFileMapping.get(originalUrl);
        if (fileData?.blobUrl) {
            modifiedContent = modifiedContent.split(originalUrl).join(fileData.blobUrl);
        }
    }

    return modifiedContent;
}
