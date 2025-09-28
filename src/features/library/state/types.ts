export interface LibraryStateContext {
    errorMessage?: string,
}

export interface OpenFileEvent {
    type: 'OPEN_FILE',
    file: File,
}

interface CloseErrorToastEvent { type: 'CLOSE_ERROR_TOAST' }

export type LibraryStateEvents =
    | OpenFileEvent
    | CloseErrorToastEvent;