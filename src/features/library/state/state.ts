import { setup, createActor, assign, enqueueActions } from 'xstate';
import { DatabaseController } from 'src/controllers';
import { xStateUtils } from 'src/utils';
import type { BookAttributes } from 'src/types';
import { initiatorActor, fileOpenerActor, bookRemoverActor } from './actors';
import { selectBookAction } from './actions';
import type {
    LibraryStateContext,
    LibraryStateEvents,
    OpenFileEvent,
    RemoveBookEvent,
} from './types';

export const libraryStateMachine = setup({
    actors: {
        initiatorActor,
        fileOpenerActor,
        bookRemoverActor,
    },
    types: {
        context: {} as LibraryStateContext,
        events: {} as LibraryStateEvents,
    }
}).createMachine({
    id: 'LIBRARY',

    context: {
        dbController: new DatabaseController<BookAttributes>({
            name: 'books-db',
            indexName: 'books',
            indexKeyPath: 'eisbn',
        }),
        storedBooks: [],
    },

    initial: 'INITIATING',

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
            },
        },

        INITIATING: {
            invoke: {
                src: 'initiatorActor',
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
    },

    on: {
        SET_NAVIGATOR: {
            actions: assign(({ event }) => ({ navigator: event.navigator })),
        },
    }
});

export const libraryStateMachineActor = createActor(libraryStateMachine).start();
