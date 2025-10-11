import { setup, createActor, assign, enqueueActions } from 'xstate';
import { DatabaseController } from 'src/controllers';
import { xStateUtils } from 'src/utils';
import type { BookAttributes } from 'src/types';
import { LIBRARY_DB_CONFIG } from '../constants';
import {
    initializerActor,
    fileOpenerActor,
    bookRemoverActor,
    cleanupActor,
} from './actors';
import { selectBookAction } from './actions';
import type {
    LibraryStateContext,
    LibraryStateEvents,
    OpenFileEvent,
    RemoveBookEvent,
} from './types';

export const libraryStateMachine = setup({
    actors: {
        initializerActor,
        fileOpenerActor,
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

    initial: 'IDLE',

    states: {
        IDLE: {
            on: {
                OPEN_FILE: 'OPENING_FILE',
                REMOVE_BOOK: 'REMOVING_BOOK',
                CLOSE_ERROR_TOAST: {
                    actions: assign(() => ({ errorMessage: undefined })),
                },
                SELECT_BOOK: {
                    actions: enqueueActions(selectBookAction),
                },
                INITIALIZE: 'INITIALIZING',
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
                        storedBooks: event.output,
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
        CLEANUP: '.CLEANING_UP',
    }
});

export const libraryStateMachineActor = createActor(libraryStateMachine).start();
