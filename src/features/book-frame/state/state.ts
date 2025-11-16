import { setup, createActor, assign, enqueueActions, sendTo } from 'xstate';
import { bookLoaderStateMachine } from '../loader/state';
import { TEXT_SELECT_DELAY } from '../constants';
import {
    initializeBookAction,
    chapterLoadAction,
    pageTurnNextAction,
    pageTurnPrevAction,
    frameTouchStartAction,
    frameTouchMoveAction,
    frameTouchEndAction,
    frameTouchCancelAction,
    frameResizeAction,
    selectTextAction,
    updateSettingsCSSAction,
    updateFontCSSAction,
    updateBookSpineAction,
    storeHighlightAction,
    deleteHighlightAction,
    restoreHighlightsAction,
    updateHighlightsCSSAction,
    clearTextSelectionAction,
    navigateAction,
} from './actions';
import type {
    BookFrameStateContext,
    BookFrameStateEvents,
} from './types';

export const bookFrameStateMachine = setup({
    actors: {
        bookLoaderStateMachine,
    },
    types: {
        context: {} as BookFrameStateContext,
        events: {} as BookFrameStateEvents,
    }
}).createMachine({
    id: 'BOOK_FRAME',

    context: {
        readProgress: {
            chapter: 0,
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
        chapterHadBeenInteracted: false,
        chapterScrolledToEnd: false,
        menuPanelsVisible: false,
    },

    entry: [
        assign({
            loaderMachineRef: ({ spawn }) => spawn('bookLoaderStateMachine', { id: 'loader' }),
        }),
    ],

    initial: 'IDLE',

    states: {
        IDLE: {
            on: {
                LOAD_BOOK: {
                    actions: sendTo('loader', ({ event }) => event),
                },
                BOOK_LOAD_SUCCESS: {
                    actions: enqueueActions(initializeBookAction),
                },
                BOOK_LOAD_ERROR: {
                    actions: assign(({ event }) => ({ errorMessage: event.errorMessage })),
                },
                CLOSE_BOOK_LOAD_ERROR: {
                    actions: assign(() => ({ errorMessage: undefined })),
                },
                CHAPTER_LOAD: {
                    actions: enqueueActions(chapterLoadAction),
                },
                FRAME_TOUCH_START: {
                    target: 'TOUCHED',
                    actions: enqueueActions(frameTouchStartAction),
                },
                PAGE_TURN_NEXT: {
                    actions: enqueueActions(pageTurnNextAction),
                },
                PAGE_TURN_PREV: {
                    actions: enqueueActions(pageTurnPrevAction),
                },
                SETTINGS_OPEN: 'SETTINGS_OPENED',
                UPDATE_SETTINGS_CSS: {
                    actions: enqueueActions(updateSettingsCSSAction),
                },
                UPDATE_FONT_CSS: {
                    actions: enqueueActions(updateFontCSSAction),
                },
                UPDATE_HIGHLIGHTS_CSS: {
                    actions: enqueueActions(updateHighlightsCSSAction),
                },
                UPDATE_BOOK_SPINE: {
                    actions: enqueueActions(updateBookSpineAction),
                },
                STORE_HIGHLIGHT: {
                    actions: enqueueActions(storeHighlightAction),
                },
                RESTORE_HIGHLIGHTS: {
                    actions: enqueueActions(restoreHighlightsAction),
                },
                DELETE_HIGHLIGHT: {
                    actions: enqueueActions(deleteHighlightAction),
                },
                REQUEST_WORD_ANALYSIS: {
                    target: 'ANALYZING_WORD',
                    actions: enqueueActions(clearTextSelectionAction),
                },
                NAVIGATION_OPEN: 'NAVIGATION_OPENED',
            },
        },

        TOUCHED: {
            after: {
                [TEXT_SELECT_DELAY]: {
                    actions: enqueueActions(selectTextAction),
                },
            },
            on: {
                FRAME_TOUCH_MOVE: {
                    actions: enqueueActions(frameTouchMoveAction),
                },
                FRAME_TOUCH_END: {
                    target: 'IDLE',
                    actions: enqueueActions(frameTouchEndAction),
                },
                FRAME_TOUCH_CANCEL: {
                    target: 'IDLE',
                    actions: enqueueActions(frameTouchCancelAction),
                },
            },
        },

        ANALYZING_WORD: {
            on: {
                FRAME_TOUCH_START: {
                    target: 'IDLE',
                },
            },
        },

        SETTINGS_OPENED: {
            on: {
                SETTINGS_CLOSE: 'IDLE',
            },
        },

        NAVIGATION_OPENED: {
            on: {
                NAVIGATE: {
                    actions: enqueueActions(navigateAction),
                },
                NAVIGATION_CLOSE: 'IDLE',
            },
        },
    },

    on: {
        FRAME_BODY_RESIZE: {
            actions: enqueueActions(frameResizeAction),
        },
        SAVE_READ_PROGRESS: {
            actions: sendTo('loader', ({ event }) => event),
        },
        HIDE_MENU_PANELS: {
            actions: assign(() => ({ menuPanelsVisible: false })),
        },
    },
});

export const bookFrameStateMachineActor = createActor(bookFrameStateMachine).start();