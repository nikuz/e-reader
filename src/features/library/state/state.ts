import { setup, createActor, assign } from 'xstate';
import { initiatorActor, fileOpenerActor } from './actors';
import type {
    LibraryStateContext,
    LibraryStateEvents,
    OpenFileEvent,
} from './types';

export const libraryStateMachine = setup({
    actors: {
        initiatorActor,
        fileOpenerActor,
    },
    types: {
        context: {} as LibraryStateContext,
        events: {} as LibraryStateEvents,
    }
}).createMachine({
    id: 'LIBRARY',

    context: {
        
    },

    initial: 'INITIATING',

    states: {
        IDLE: {
            on: {
                OPEN_FILE: 'OPENING_FILE',
                CLOSE_ERROR_TOAST: {
                    actions: assign(() => ({ errorMessage: undefined })),
                },
            },
        },

        INITIATING: {
            invoke: {
                src: 'initiatorActor',
                onDone: {
                    target: 'IDLE',
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
                input: ({ event }) => event as OpenFileEvent,
                onDone: {
                    target: 'IDLE',
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
});

export const libraryStateMachineActor = createActor(libraryStateMachine).start();