import type { BookAttributes } from 'src/features/library/types';

export interface SettingsCSSChangeMessage {
    type: 'SETTINGS_CSS_CHANGE',
    bookAttributes: BookAttributes,
    settingsCSS: string,
    currentChapterUrl?: string,
}

export type SettingsWatcherWorkerMessage = SettingsCSSChangeMessage;

export interface WorkerBookAttributesUpdateMessage {
    type: 'WORKER_BOOK_ATTRIBUTE_UPDATE',
    bookAttributes: BookAttributes,
}

export interface SettingsWatcherWorker extends Omit<Worker, 'postMessage'> {
    postMessage(message: SettingsWatcherWorkerMessage, transfer?: Transferable[]): void,
}