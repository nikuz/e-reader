import { setup, createActor, assign } from 'xstate';
import { bookLoaderActor } from './actors';
import type { bookFrameStateContext, bookFrameStateEvents } from './types';

export const bookFrameStateMachine = setup({
    actors: {
        bookLoaderActor,
    },
    types: {
        context: {} as bookFrameStateContext,
        events: {} as bookFrameStateEvents,
    }
}).createMachine({
    id: 'BOOK_FRAME',

    context: {
        
    },

    initial: 'IDLE',

    states: {
        IDLE: {
            on: {
                LOAD_BOOK: 'LOADING_BOOK',
            },
        },

        LOADING_BOOK: {
            invoke: {
                src: 'bookLoaderActor',
                input: ({ event }) => event,
                onDone: {
                    target: 'IDLE',
                    actions: assign(({ event }) => ({
                        book: event.output,
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
    },

    on: {
        
    },
});

export const bookFrameStateMachineActor = createActor(bookFrameStateMachine).start();