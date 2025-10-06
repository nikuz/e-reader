import { Filesystem } from '@capacitor/filesystem';
import { FileStorageDirectory } from './types';
import type {
    FileStorageAppendFileOptions,
    FileStorageCallbackId,
    FileStorageCopyOptions,
    FileStorageCopyResult,
    FileStorageDeleteFileOptions,
    FileStorageDownloadFileOptions,
    FileStorageDownloadFileResult,
    FileStorageGetUriOptions,
    FileStorageGetUriResult,
    FileStorageMkdirOptions,
    FileStoragePermissionStatus,
    FileStorageReadFileInChunksCallback,
    FileStorageReadFileInChunksOptions,
    FileStorageReadFileOptions,
    FileStorageReadFileResult,
    FileStorageReaddirOptions,
    FileStorageReaddirResult,
    FileStorageRenameOptions,
    FileStorageRmdirOptions,
    FileStorageStatOptions,
    FileStorageStatResult,
    FileStorageWriteFileOptions,
    FileStorageWriteFileResult,
    FileStorageProgressListener,
    FileStoragePluginListenerHandle,
} from './types';

export class FileStorageController {
    private static readonly filesystem = Filesystem as unknown as FileStorageFilesystem;

    static async checkPermissions(): Promise<FileStoragePermissionStatus> {
        return this.filesystem.checkPermissions();
    }

    static async requestPermissions(): Promise<FileStoragePermissionStatus> {
        return this.filesystem.requestPermissions();
    }

    static async readFile(options: FileStorageReadFileOptions): Promise<FileStorageReadFileResult> {
        return this.filesystem.readFile(this.ensureDirectory(options));
    }

    static async readFileInChunks(
        options: FileStorageReadFileInChunksOptions,
        callback: FileStorageReadFileInChunksCallback,
    ): Promise<FileStorageCallbackId> {
        return this.filesystem.readFileInChunks(this.ensureDirectory(options), callback);
    }

    static async writeFile(options: FileStorageWriteFileOptions): Promise<FileStorageWriteFileResult> {
        return this.filesystem.writeFile(this.ensureDirectory(options));
    }

    static async appendFile(options: FileStorageAppendFileOptions): Promise<void> {
        await this.filesystem.appendFile(this.ensureDirectory(options));
    }

    static async deleteFile(options: FileStorageDeleteFileOptions): Promise<void> {
        await this.filesystem.deleteFile(this.ensureDirectory(options));
    }

    static async mkdir(options: FileStorageMkdirOptions): Promise<void> {
        await this.filesystem.mkdir(this.ensureDirectory(options));
    }

    static async rmdir(options: FileStorageRmdirOptions): Promise<void> {
        await this.filesystem.rmdir(this.ensureDirectory(options));
    }

    static async readdir(options: FileStorageReaddirOptions): Promise<FileStorageReaddirResult> {
        return this.filesystem.readdir(this.ensureDirectory(options));
    }

    static async getUri(options: FileStorageGetUriOptions): Promise<FileStorageGetUriResult> {
        return this.filesystem.getUri(this.ensureDirectory(options));
    }

    static async stat(options: FileStorageStatOptions): Promise<FileStorageStatResult> {
        return this.filesystem.stat(this.ensureDirectory(options));
    }

    static async rename(options: FileStorageRenameOptions): Promise<void> {
        await this.filesystem.rename(this.ensureCopyDirectories(options));
    }

    static async copy(options: FileStorageCopyOptions): Promise<FileStorageCopyResult> {
        return this.filesystem.copy(this.ensureCopyDirectories(options));
    }

    static async downloadFile(
        options: FileStorageDownloadFileOptions,
    ): Promise<FileStorageDownloadFileResult> {
        return this.filesystem.downloadFile(this.ensureDirectory(options));
    }

    static async addListener(
        eventName: 'progress',
        listener: FileStorageProgressListener,
    ): Promise<FileStoragePluginListenerHandle> {
        return this.filesystem.addListener(eventName, listener);
    }

    static async removeAllListeners(): Promise<void> {
        await this.filesystem.removeAllListeners();
    }

    private static ensureDirectory<T extends { directory?: FileStorageDirectory }>(
        options: T,
    ): T {
        return {
            ...options,
            directory: options.directory ?? FileStorageDirectory.Data,
        };
    }

    private static ensureCopyDirectories(options: FileStorageCopyOptions): FileStorageCopyOptions {
        return {
            ...options,
            directory: options.directory ?? FileStorageDirectory.Data,
            toDirectory: options.toDirectory ?? options.directory ?? FileStorageDirectory.Data,
        };
    }
}

interface FileStorageFilesystem {
    checkPermissions(): Promise<FileStoragePermissionStatus>;
    requestPermissions(): Promise<FileStoragePermissionStatus>;
    readFile(options: FileStorageReadFileOptions): Promise<FileStorageReadFileResult>;
    readFileInChunks(
        options: FileStorageReadFileInChunksOptions,
        callback: FileStorageReadFileInChunksCallback,
    ): Promise<FileStorageCallbackId>;
    writeFile(options: FileStorageWriteFileOptions): Promise<FileStorageWriteFileResult>;
    appendFile(options: FileStorageAppendFileOptions): Promise<void>;
    deleteFile(options: FileStorageDeleteFileOptions): Promise<void>;
    mkdir(options: FileStorageMkdirOptions): Promise<void>;
    rmdir(options: FileStorageRmdirOptions): Promise<void>;
    readdir(options: FileStorageReaddirOptions): Promise<FileStorageReaddirResult>;
    getUri(options: FileStorageGetUriOptions): Promise<FileStorageGetUriResult>;
    stat(options: FileStorageStatOptions): Promise<FileStorageStatResult>;
    rename(options: FileStorageRenameOptions): Promise<void>;
    copy(options: FileStorageCopyOptions): Promise<FileStorageCopyResult>;
    downloadFile(options: FileStorageDownloadFileOptions): Promise<FileStorageDownloadFileResult>;
    addListener(
        eventName: 'progress',
        listener: FileStorageProgressListener,
    ): Promise<FileStoragePluginListenerHandle>;
    removeAllListeners(): Promise<void>;
}
