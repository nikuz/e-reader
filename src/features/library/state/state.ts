import { setup, createActor, assign, enqueueActions } from 'xstate';
import { xStateUtils } from 'src/utils';
import {
    initializerActor,
    lastSelectedBookLoaderActor,
    booksLoaderActor,
    fileOpenerActor,
    bookSelectorActor,
    bookRemoverActor,
    highlightUpdaterActor,
    databaseCleanerActor,
} from './actors';
import {
    addOpenedBookAction,
    selectBookAction,
    updateBookHighlightsAction,
} from './actions';
import type {
    LibraryStateContext,
    LibraryStateEvents,
    OpenFileEvent,
    RemoveBookEvent,
    UpdateBookHighlightsEvent,
} from './types';

export const libraryStateMachine = setup({
    actors: {
        initializerActor,
        lastSelectedBookLoaderActor,
        booksLoaderActor,
        fileOpenerActor,
        bookSelectorActor,
        bookRemoverActor,
        highlightUpdaterActor,
        databaseCleanerActor,
    },
    types: {
        context: {} as LibraryStateContext,
        events: {} as LibraryStateEvents,
    }
}).createMachine({
    id: 'LIBRARY',

    context: {
        storedBooks: [],
    },

    initial: 'INITIALIZING',

    states: {
        IDLE: {
            on: {
                LOAD_LAST_SELECTED_BOOK: 'LOADING_LAST_SELECTED_BOOK',
                LOAD_BOOKS: 'LOADING_BOOKS',
                OPEN_FILE: 'OPENING_FILE',
                REMOVE_BOOK: 'REMOVING_BOOK',
                CLOSE_ERROR_TOAST: {
                    actions: assign(() => ({ errorMessage: undefined })),
                },
                SELECT_BOOK: 'SELECTING_BOOK',
                UPDATE_BOOK_HIGHLIGHTS: 'UPDATING_BOOK_HIGHLIGHTS',
                CLEAR_DATABASE: 'CLEARING_DATABASE',
            },
        },

        INITIALIZING: {
            invoke: {
                src: 'initializerActor',
                onDone: 'IDLE',
                onError: {
                    target: 'IDLE',
                    actions: [
                        assign(({ event }) => ({
                            errorMessage: event.error?.toString(),
                        })),
                        xStateUtils.stateErrorTraceAction,
                    ],
                },
            },
        },

        LOADING_LAST_SELECTED_BOOK: {
            invoke: {
                src: 'lastSelectedBookLoaderActor',
                onDone: {
                    target: 'IDLE',
                    actions: assign(({ event }) => ({
                        lastSelectedBook: event.output,
                    })),
                },
                onError: {
                    target: 'IDLE',
                    actions: [
                        assign(({ event }) => ({
                            errorMessage: event.error?.toString(),
                        })),
                        xStateUtils.stateErrorTraceAction,
                    ],
                },
            },
        },
        
        LOADING_BOOKS: {
            invoke: {
                src: 'booksLoaderActor',
                onDone: {
                    target: 'IDLE',
                    actions: assign(({ event }) => ({
                        storedBooks: event.output,
                    })),
                },
                onError: {
                    target: 'IDLE',
                    actions: [
                        assign(({ event }) => ({
                            errorMessage: event.error?.toString(),
                        })),
                        xStateUtils.stateErrorTraceAction,
                    ],
                },
            },
        },

        OPENING_FILE: {
            invoke: {
                src: 'fileOpenerActor',
                input: ({ event }) => ({
                    file: (event as OpenFileEvent).file,
                }),
                onDone: {
                    target: 'SELECTING_BOOK',
                    actions: enqueueActions(addOpenedBookAction),
                },
                onError: {
                    target: 'IDLE',
                    actions: [
                        assign(({ event }) => ({
                            errorMessage: event.error?.toString(),
                        })),
                        xStateUtils.stateErrorTraceAction,
                    ],
                },
            },
        },

        SELECTING_BOOK: {
            invoke: {
                src: 'bookSelectorActor',
                input: ({ context, event }) => ({
                    book: event.type === 'SELECT_BOOK'
                        ? event.book
                        : context.storedBooks[0]
                }),
                onDone: {
                    target: 'IDLE',
                    actions: enqueueActions(selectBookAction),
                },
                onError: {
                    target: 'IDLE',
                    actions: [
                        assign(({ event }) => ({
                            errorMessage: event.error?.toString(),
                        })),
                        xStateUtils.stateErrorTraceAction,
                    ],
                },
            },
        },

        REMOVING_BOOK: {
            invoke: {
                src: 'bookRemoverActor',
                input: ({ event }) => ({
                    bookAttributes: (event as RemoveBookEvent).book,
                }),
                onDone: {
                    target: 'IDLE',
                    actions: assign(({ event, context }) => ({
                        storedBooks: context.storedBooks.filter(
                            (book) => book.eisbn !== event.output.eisbn,
                        ),
                    })),
                },
                onError: {
                    target: 'IDLE',
                    actions: [
                        assign(({ event }) => ({
                            errorMessage: event.error?.toString(),
                        })),
                        xStateUtils.stateErrorTraceAction,
                    ],
                },
            },
        },

        UPDATING_BOOK_HIGHLIGHTS: {
            invoke: {
                src: 'highlightUpdaterActor',
                input: ({ event }) => ({
                    book: (event as UpdateBookHighlightsEvent).book,
                }),
                onDone: {
                    target: 'IDLE',
                    actions: enqueueActions(updateBookHighlightsAction),
                },
                onError: {
                    target: 'IDLE',
                    actions: [
                        assign(({ event }) => ({
                            errorMessage: event.error?.toString(),
                        })),
                        xStateUtils.stateErrorTraceAction,
                    ],
                },
            },
        },

        CLEARING_DATABASE: {
            invoke: {
                src: 'databaseCleanerActor',
            },
        },
    },

    on: {
        SET_NAVIGATOR: {
            actions: assign(({ event }) => ({ navigator: event.navigator })),
        },
    }
});

export const libraryStateMachineActor = createActor(libraryStateMachine).start();
