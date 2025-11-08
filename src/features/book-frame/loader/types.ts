import type { BookModel } from 'src/models';
import type { BookReadProgress } from '../types';

export interface BookLoaderStateContext {
    book?: BookModel,
}

export interface LoadBookEvent {
    type: 'LOAD_BOOK',
    book: BookModel,
}

export interface SaveReadProgressEvent {
    type: 'SAVE_READ_PROGRESS',
    progress: BookReadProgress,
}

export type BookLoaderStateEvents =
    | LoadBookEvent
    | SaveReadProgressEvent;