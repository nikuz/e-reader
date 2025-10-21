import { setup, sendParent, assign, enqueueActions } from 'xstate';
import { xStateUtils } from 'src/utils';
import type { BookLoadSuccessEvent, BookLoadErrorEvent } from '../state/types';
import { bookLoaderActor, readProgressSaverActor } from './actors';
import { revokePrevBookUrlsAction } from './actions';
import type {
    BookLoaderStateEvents,
    LoadBookEvent,
    SaveReadProgressEvent,
} from './types';

export const bookLoaderStateMachine = setup({
    actors: {
        bookLoaderActor,
        readProgressSaverActor,
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
                LOAD_BOOK: {
                    target: 'LOADING_BOOK',
                    actions: enqueueActions(revokePrevBookUrlsAction),
                },
            },
        },

        LOADING_BOOK: {
            invoke: {
                src: 'bookLoaderActor',
                input: ({ event }) => event as LoadBookEvent,
                onDone: {
                    target: 'IDLE',
                    actions: [
                        assign(({ event }) => ({ bookAttributes: event.output.bookAttributes })),
                        sendParent(({ event }): BookLoadSuccessEvent => ({
                            type: 'BOOK_LOAD_SUCCESS',
                            bookAttributes: event.output.bookAttributes,
                            readProgress: event.output.readProgress,
                        })),
                    ],
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
        
        SAVING_READ_PROGRESS: {
            invoke: {
                src: 'readProgressSaverActor',
                input: ({ event, context }) => ({
                    bookAttributes: context.bookAttributes,
                    readProgress: (event as SaveReadProgressEvent).progress,
                }),
                onDone: 'IDLE',
                onError: {
                    target: 'IDLE',
                    actions: xStateUtils.stateErrorTraceAction,
                },
            },
        },
    },

    on: {
        SAVE_READ_PROGRESS: '.SAVING_READ_PROGRESS',
    }
});