import type { BookAttributes } from 'src/types';

interface LoadBookEvent {
    type: 'LOAD_BOOK',
    bookAttributes: BookAttributes,
}

export type BookLoaderStateEvents =
    | LoadBookEvent;