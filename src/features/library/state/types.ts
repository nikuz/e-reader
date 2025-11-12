import type { NavigateFunction } from 'react-router-dom';
import type { BookModel } from 'src/models';

export interface LibraryStateContext {
    navigator?: NavigateFunction,

    storedBooks: BookModel[],
    lastSelectedBook?: BookModel,

    errorMessage?: string,
}

interface SetNavigatorEvent {
    type: 'SET_NAVIGATOR',
    navigator: NavigateFunction,
}

export interface LoadLastSelectedBookEvent { type: 'LOAD_LAST_SELECTED_BOOK' }

export interface LoadBooksEvent { type: 'LOAD_BOOKS' }

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

export interface ClearDatabaseEvent { type: 'CLEAR_DATABASE' }

export type LibraryStateEvents =
    | SetNavigatorEvent
    | LoadLastSelectedBookEvent
    | LoadBooksEvent
    | OpenFileEvent
    | CloseErrorToastEvent
    | SelectBookEvent
    | RemoveBookEvent
    | UpdateBookHighlightsEvent
    | ClearDatabaseEvent;
