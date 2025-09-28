import { setup, createActor, assign } from 'xstate';
import { fileOpenerActor } from './actors';
import type {
    LibraryStateContext,
    LibraryStateEvents,
    OpenFileEvent,
} from './types';

export const libraryStateMachine = setup({
    actors: {
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

    initial: 'IDLE',

    states: {
        IDLE: {
            on: {
                OPEN_FILE: 'OPENING_FILE',
                CLOSE_ERROR_TOAST: {
                    actions: assign(() => ({ errorMessage: undefined })),
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