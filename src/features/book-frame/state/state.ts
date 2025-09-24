import { setup, createActor, assign, enqueueActions } from 'xstate';
import { bookLoaderActor } from './actors';
import {
    initiateBookAction,
    chapterLoadAction,
    pageTurnNextAction,
    pageTurnPrevAction,
    frameTouchStartAction,
    frameTouchMoveAction,
    frameTouchEndAction,
    frameTouchCancelAction,
    frameResizeAction,
    selectTextAction,
} from './actions';
import type {
    BookFrameStateContext,
    BookFrameStateEvents,
    LoadBookEvent,
} from './types';

export const bookFrameStateMachine = setup({
    actors: {
        bookLoaderActor,
    },
    types: {
        context: {} as BookFrameStateContext,
        events: {} as BookFrameStateEvents,
    }
}).createMachine({
    id: 'BOOK_FRAME',

    context: {
        settings: {
            chapter: 0,
            chapterUrl: '',
            page: 0,
        },
        scrollPosition: 0,
        screenRect: {
            width: 0,
            height: 0,
        },
        chapterRect: {
            width: 0,
            height: 0,
        },
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
                input: ({ event }) => event as LoadBookEvent,
                onDone: {
                    target: 'LOADED',
                    actions: enqueueActions(initiateBookAction),
                },
                onError: {
                    target: 'IDLE',
                    actions: assign(({ event }) => ({
                        errorMessage: event.error?.toString(),
                    })),
                },
            },
        },

        LOADED: {
            on: {
                LOAD_BOOK: 'LOADING_BOOK',
                CHAPTER_LOAD: {
                    actions: enqueueActions(chapterLoadAction),
                },
                FRAME_TOUCH_START: {
                    actions: enqueueActions(frameTouchStartAction),
                },
                FRAME_TOUCH_MOVE: {
                    actions: enqueueActions(frameTouchMoveAction),
                },
                FRAME_TOUCH_END: {
                    actions: enqueueActions(frameTouchEndAction),
                },
                FRAME_TOUCH_CANCEL: {
                    actions: enqueueActions(frameTouchCancelAction),
                },
                FRAME_RESIZE: {
                    actions: enqueueActions(frameResizeAction),
                },
                FRAME_BODY_RESIZE: {
                    actions: assign(({ event }) => ({
                        chapterRect: event.rect,
                    })),
                },
                PAGE_TURN_NEXT: {
                    actions: enqueueActions(pageTurnNextAction),
                },
                PAGE_TURN_PREV: {
                    actions: enqueueActions(pageTurnPrevAction),
                },
                SELECT_TEXT: {
                    actions: enqueueActions(selectTextAction),
                },
            },
        },
    },
});

export const bookFrameStateMachineActor = createActor(bookFrameStateMachine).start();