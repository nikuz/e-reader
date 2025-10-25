import type { Book } from 'src/models';
import type { BookReadProgress } from '../types';

export interface BookLoaderStateContext {
    book?: Book,
}

export interface LoadBookEvent {
    type: 'LOAD_BOOK',
    book: Book,
}

export interface SaveReadProgressEvent {
    type: 'SAVE_READ_PROGRESS',
    progress: BookReadProgress,
}

export type BookLoaderStateEvents =
    | LoadBookEvent
    | SaveReadProgressEvent;