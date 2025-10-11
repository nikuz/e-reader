import type { BookAttributes } from 'src/features/library/types';

interface LoadBookEvent {
    type: 'LOAD_BOOK',
    bookAttributes: BookAttributes,
}

export type BookLoaderStateEvents =
    | LoadBookEvent;