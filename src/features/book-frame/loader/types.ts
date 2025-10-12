import type { BookAttributes } from 'src/features/library/types';
import type { BookReadProgress } from '../types';

export interface BookLoaderStateContext {
    bookAttributes?: BookAttributes,
}

export interface LoadBookEvent {
    type: 'LOAD_BOOK',
    bookAttributes: BookAttributes,
}

export interface SaveReadProgressEvent {
    type: 'SAVE_READ_PROGRESS',
    progress: BookReadProgress,
}

export type BookLoaderStateEvents =
    | LoadBookEvent
    | SaveReadProgressEvent;