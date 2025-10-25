import type { NavigateFunction } from 'react-router-dom';
import type { DatabaseController } from 'src/controllers';
import type { Book } from 'src/models';
import type { BookAttributes } from 'src/types';

export interface LibraryStateContext {
    dbController: DatabaseController<BookAttributes>,
    navigator?: NavigateFunction,

    storedBooks: Book[],
    lastSelectedBook?: Book,

    errorMessage?: string,
}

interface SetNavigatorEvent {
    type: 'SET_NAVIGATOR',
    navigator: NavigateFunction,
}

export interface OpenFileEvent {
    type: 'OPEN_FILE',
    file: File,
}

interface CloseErrorToastEvent { type: 'CLOSE_ERROR_TOAST' }

export interface SelectBookEvent {
    type: 'SELECT_BOOK',
    book: Book,
}

export interface RemoveBookEvent {
    type: 'REMOVE_BOOK',
    book: Book,
}

export interface UpdateBookHighlightsEvent {
    type: 'UPDATE_BOOK_HIGHLIGHTS',
    book: Book,
}

export type LibraryStateEvents =
    | SetNavigatorEvent
    | OpenFileEvent
    | CloseErrorToastEvent
    | SelectBookEvent
    | RemoveBookEvent
    | UpdateBookHighlightsEvent;
