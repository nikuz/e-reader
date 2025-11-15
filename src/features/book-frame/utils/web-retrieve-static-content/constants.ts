import { FILE_STORAGE_DEFAULT_DIRECTORY } from 'src/controllers';

export const STATIC_FILE_REGEXP = new RegExp(`${FILE_STORAGE_DEFAULT_DIRECTORY}`);

// MIME type mappings for common file extensions
export const MIME_TYPES: Record<string, string> = {
    // Images
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.bmp': 'image/bmp',
    '.ico': 'image/x-icon',

    // Fonts
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.otf': 'font/otf',
    '.eot': 'application/vnd.ms-fontobject',

    // Stylesheets
    '.css': 'text/css',

    // Documents
    '.xhtml': 'application/xhtml+xml',
    '.html': 'text/html',
    '.xml': 'application/xml',
};