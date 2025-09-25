interface LoadBookEvent {
    type: 'LOAD_BOOK',
    src: string,
}

export type BookLoaderStateEvents =
    | LoadBookEvent;