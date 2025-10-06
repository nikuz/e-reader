export type FileStorageCallbackId = string;

export type FileStoragePermissionState =
    | 'prompt'
    | 'prompt-with-rationale'
    | 'granted'
    | 'denied';

export interface FileStoragePermissionStatus {
    publicStorage: FileStoragePermissionState;
}

export enum FileStorageDirectory {
    Documents = 'DOCUMENTS',
    Data = 'DATA',
    Library = 'LIBRARY',
    Cache = 'CACHE',
    External = 'EXTERNAL',
    ExternalStorage = 'EXTERNAL_STORAGE',
    ExternalCache = 'EXTERNAL_CACHE',
    LibraryNoCloud = 'LIBRARY_NO_CLOUD',
    Temporary = 'TEMPORARY',
}

export enum FileStorageEncoding {
    UTF8 = 'utf8',
    ASCII = 'ascii',
    UTF16 = 'utf16',
}

export interface FileStorageWriteFileOptions {
    path: string;
    data: string | Blob;
    directory?: FileStorageDirectory;
    encoding?: FileStorageEncoding;
    recursive?: boolean;
}

export interface FileStorageAppendFileOptions {
    path: string;
    data: string;
    directory?: FileStorageDirectory;
    encoding?: FileStorageEncoding;
}

export interface FileStorageReadFileOptions {
    path: string;
    directory?: FileStorageDirectory;
    encoding?: FileStorageEncoding;
}

export interface FileStorageReadFileInChunksOptions extends FileStorageReadFileOptions {
    chunkSize: number;
}

export interface FileStorageDeleteFileOptions {
    path: string;
    directory?: FileStorageDirectory;
}

export interface FileStorageMkdirOptions {
    path: string;
    directory?: FileStorageDirectory;
    recursive?: boolean;
}

export interface FileStorageRmdirOptions {
    path: string;
    directory?: FileStorageDirectory;
    recursive?: boolean;
}

export interface FileStorageReaddirOptions {
    path: string;
    directory?: FileStorageDirectory;
}

export interface FileStorageGetUriOptions {
    path: string;
    directory?: FileStorageDirectory;
}

export interface FileStorageStatOptions {
    path: string;
    directory?: FileStorageDirectory;
}

export interface FileStorageCopyOptions {
    from: string;
    to: string;
    directory?: FileStorageDirectory;
    toDirectory?: FileStorageDirectory;
}

export type FileStorageRenameOptions = FileStorageCopyOptions;

export interface FileStorageReadFileResult {
    data: string | Blob;
}

export interface FileStorageWriteFileResult {
    uri: string;
}

export interface FileStorageFileInfo {
    name: string;
    type: 'directory' | 'file';
    size: number;
    ctime?: number;
    mtime: number;
    uri: string;
}

export interface FileStorageReaddirResult {
    files: FileStorageFileInfo[];
}

export type FileStorageStatResult = FileStorageFileInfo;

export interface FileStorageGetUriResult {
    uri: string;
}

export interface FileStorageCopyResult {
    uri: string;
}

export interface FileStorageDownloadFileOptions extends FileStorageHttpOptions {
    path: string;
    directory?: FileStorageDirectory;
    progress?: boolean;
    recursive?: boolean;
}

export interface FileStorageDownloadFileResult {
    path?: string;
    blob?: Blob;
}

export interface FileStorageProgressStatus {
    url: string;
    bytes: number;
    contentLength: number;
}

export type FileStorageProgressListener = (progress: FileStorageProgressStatus) => void;

export interface FileStoragePluginListenerHandle {
    remove: () => Promise<void>;
}

export interface FileStorageHttpOptions {
    url: string;
    method?: string;
    params?: Record<string, string | string[]>;
    data?: unknown;
    headers?: Record<string, string>;
    readTimeout?: number;
    connectTimeout?: number;
    disableRedirects?: boolean;
    webFetchExtra?: RequestInit;
    responseType?: 'arraybuffer' | 'blob' | 'json' | 'text' | 'document';
    shouldEncodeUrlParams?: boolean;
    dataType?: string;
}

export type FileStorageReadFileInChunksCallback = (
    chunk: FileStorageReadFileResult | null,
    error?: unknown,
) => void;

export type FileStoragePluginError = {
    code: string;
    message: string;
};
