import { setup, createActor, assign, enqueueActions } from 'xstate';
import { DatabaseController } from 'src/controllers';
import { xStateUtils } from 'src/utils';
import { LIBRARY_DB_CONFIG } from '../constants';
import type { BookAttributes } from '../types';
import {
    initializerActor,
    fileOpenerActor,
    bookSelectorActor,
    bookRemoverActor,
    cleanupActor,
} from './actors';
import { addOpenedBookAction, selectBookAction } from './actions';
import type {
    LibraryStateContext,
    LibraryStateEvents,
    OpenFileEvent,
    RemoveBookEvent,
    SelectBookEvent,
} from './types';

export const libraryStateMachine = setup({
    actors: {
        initializerActor,
        fileOpenerActor,
        bookSelectorActor,
        bookRemoverActor,
        cleanupActor,
    },
    types: {
        context: {} as LibraryStateContext,
        events: {} as LibraryStateEvents,
    }
}).createMachine({
    id: 'LIBRARY',

    context: {
        dbController: new DatabaseController<BookAttributes>(LIBRARY_DB_CONFIG),
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
                    actions: assign(({ event }) => ({
                        errorMessage: event.error?.toString(),
                    })),
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
                    bookAttributes: (event as SelectBookEvent).bookAttributes,
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
                    bookAttributes: (event as RemoveBookEvent).bookAttributes,
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

        CLEANING_UP: {
            invoke: {
                src: 'cleanupActor',
                input: ({ context }) => ({
                    dbController: context.dbController,
                }),
                onDone: {
                    target: 'IDLE',
                    actions: assign(() => ({ storedBooks: [] })),
                },
                onError: {
                    target: 'IDLE',
                    actions: assign(({ event }) => ({
                        errorMessage: event.error?.toString(),
                    })),
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
