import type { Navigator } from '@solidjs/router';
import type { BookAttributes } from 'src/types';

export interface LibraryStateContext {
    navigator?: Navigator,

    errorMessage?: string,
}

interface SetNavigator {
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

export type LibraryStateEvents =
    | SetNavigator
    | OpenFileEvent
    | CloseErrorToastEvent
    | SelectBookEvent;