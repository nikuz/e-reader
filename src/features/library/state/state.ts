import { setup, createActor, assign, enqueueActions } from 'xstate';
import { DatabaseController } from 'src/controllers';
import { xStateUtils } from 'src/utils';
import { LIBRARY_DB_CONFIG } from '../constants';
import {
    initializerActor,
    fileOpenerActor,
    bookSelectorActor,
    bookRemoverActor,
    highlightUpdaterActor,
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
    SelectBookEvent,
    UpdateBookHighlightsEvent,
} from './types';

export const libraryStateMachine = setup({
    actors: {
        initializerActor,
        fileOpenerActor,
        bookSelectorActor,
        bookRemoverActor,
        highlightUpdaterActor,
    },
    types: {
        context: {} as LibraryStateContext,
        events: {} as LibraryStateEvents,
    }
}).createMachine({
    id: 'LIBRARY',

    context: {
        dbController: new DatabaseController(LIBRARY_DB_CONFIG),
        storedBooks: [],
    },

    initial: 'INITIALIZING',

    states: {
        IDLE: {
            on: {
                OPEN_FILE: 'OPENING_FILE',
                REMOVE_BOOK: 'REMOVING_BOOK',
                CLOSE_ERROR_TOAST: {
                    actions: assign(() => ({ errorMessage: undefined })),
                },
                SELECT_BOOK: 'SELECTING_BOOK',
                UPDATE_BOOK_HIGHLIGHTS: 'UPDATING_BOOK_HIGHLIGHTS',
            },
        },

        INITIALIZING: {
            invoke: {
                src: 'initializerActor',
                input: ({ context }) => ({
                    dbController: context.dbController,
                }),
                onDone: {
                    target: 'IDLE',
                    actions: assign(({ event }) => ({
                        storedBooks: event.output.books,
                        lastSelectedBook: event.output.lastSelectedBook,
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
                input: ({ event, context }) => ({
                    file: (event as OpenFileEvent).file,
                    dbController: context.dbController,
                }),
                onDone: {
                    target: 'IDLE',
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
                input: ({ event }) => ({
                    book: (event as SelectBookEvent).book,
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
                input: ({ event, context }) => ({
                    bookAttributes: (event as RemoveBookEvent).book,
                    dbController: context.dbController,
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
                input: ({ event, context }) => ({
                    book: (event as UpdateBookHighlightsEvent).book,
                    dbController: context.dbController,
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
    },

    on: {
        SET_NAVIGATOR: {
            actions: assign(({ event }) => ({ navigator: event.navigator })),
        },
    }
});

export const libraryStateMachineActor = createActor(libraryStateMachine).start();
