import type { NavigateFunction } from 'react-router-dom';
import type { DatabaseController } from 'src/controllers';
import type { BookModel } from 'src/models';

export interface LibraryStateContext {
    dbController: DatabaseController,
    navigator?: NavigateFunction,

    storedBooks: BookModel[],
    lastSelectedBook?: BookModel,

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
    book: BookModel,
}

export interface RemoveBookEvent {
    type: 'REMOVE_BOOK',
    book: BookModel,
}

export interface UpdateBookHighlightsEvent {
    type: 'UPDATE_BOOK_HIGHLIGHTS',
    book: BookModel,
}

export type LibraryStateEvents =
    | SetNavigatorEvent
    | OpenFileEvent
    | CloseErrorToastEvent
    | SelectBookEvent
    | RemoveBookEvent
    | UpdateBookHighlightsEvent;
