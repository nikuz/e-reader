import { setup, sendParent } from 'xstate';
import { xStateUtils } from 'src/utils';
import type { BookLoadSuccessEvent, BookLoadErrorEvent } from '../state/types';
import { bookLoaderActor } from './actors';
import type { BookLoaderStateEvents } from './types';

export const bookLoaderStateMachine = setup({
    actors: {
        bookLoaderActor,
    },
    types: {
        events: {} as BookLoaderStateEvents,
    }
}).createMachine({
    id: 'BOOK_LOADER',

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
                    actions: sendParent(({ event }): BookLoadSuccessEvent => ({
                        type: 'BOOK_LOAD_SUCCESS',
                        bookAttributes: event.output,
                    })),
                },
                onError: {
                    target: 'IDLE',
                    actions: [
                        sendParent(({ event }): BookLoadErrorEvent => ({
                            type: 'BOOK_LOAD_ERROR',
                            errorMessage: event.error?.toString(),
                        })),
                        xStateUtils.stateErrorTraceAction,
                    ]
                },
            },
        },
    },
});