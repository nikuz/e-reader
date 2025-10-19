import type { Navigator } from '@solidjs/router';
import type { DatabaseController } from 'src/controllers';
import type { BookAttributes } from '../types';

export interface LibraryStateContext {
    dbController: DatabaseController<BookAttributes>,
    navigator?: Navigator,

    storedBooks: BookAttributes[],
    lastSelectedBook?: BookAttributes,

    errorMessage?: string,
}

interface SetNavigatorEvent {
    type: 'SET_NAVIGATOR',
    navigator: Navigator,
}

export interface OpenFileEvent {
    type: 'OPEN_FILE',
    file: File,
}

interface CloseErrorToastEvent { type: 'CLOSE_ERROR_TOAST' }

export interface SelectBookEvent {
    type: 'SELECT_BOOK',
    bookAttributes: BookAttributes,
}

export interface RemoveBookEvent {
    type: 'REMOVE_BOOK',
    bookAttributes: BookAttributes,
}

export type LibraryStateEvents =
    | SetNavigatorEvent
    | OpenFileEvent
    | CloseErrorToastEvent
    | SelectBookEvent
    | RemoveBookEvent;
