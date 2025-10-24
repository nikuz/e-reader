import { setup, createActor, assign, enqueueActions } from 'xstate';
import { xStateUtils } from 'src/utils';
import { DefaultFontSettings, DefaultLayoutSettings, DefaultHighlightSettings } from '../defaults';
import {
    initializerActor,
    saveFontSettingsActor,
    saveLayoutSettingsActor,
    saveHighlightSettingsActor,
} from './actors';
import { generateSettingsCSSAction } from './actions';
import type {
    SettingsStateContext,
    SettingsStateEvents,
    SettingsStateFontEvents,
    SettingsStateLayoutEvents,
    SettingsStateHighlightEvents,
} from './types';

export const settingsStateMachine = setup({
    actors: {
        initializerActor,
        saveFontSettingsActor,
        saveLayoutSettingsActor,
        saveHighlightSettingsActor,
    },
    types: {
        context: {} as SettingsStateContext,
        events: {} as SettingsStateEvents,
    }
}).createMachine({
    id: 'SETTINGS',

    context: {
        font: new DefaultFontSettings(),
        layout: new DefaultLayoutSettings(),
        highlight: new DefaultHighlightSettings(),
        settingsCSS: '',
        fontCSS: '',
        highlightsCSSValue: '',
    },

    initial: 'INITIALIZING',

    states: {
        IDLE: {
            on: {
                SET_FONT_SIZE: 'SAVE_FONT_SETTINGS',
                SET_FONT_OVERRIDE_BOOK_FONTS: 'SAVE_FONT_SETTINGS',
                SET_FONT_FAMILY: 'SAVE_FONT_SETTINGS',
                SET_FONT_COLOR: 'SAVE_FONT_SETTINGS',
                SET_FONT_LINE_HEIGHT: 'SAVE_FONT_SETTINGS',
                SET_FONT_WORD_SPACING: 'SAVE_FONT_SETTINGS',
                SET_FONT_LETTER_SPACING: 'SAVE_FONT_SETTINGS',

                SET_LAYOUT_PARAGRAPH_MARGIN: 'SAVE_LAYOUT_SETTINGS',
                SET_LAYOUT_MARGIN_LEFT: 'SAVE_LAYOUT_SETTINGS',
                SET_LAYOUT_MARGIN_RIGHT: 'SAVE_LAYOUT_SETTINGS',
                SET_LAYOUT_MARGIN_TOP: 'SAVE_LAYOUT_SETTINGS',
                SET_LAYOUT_MARGIN_BOTTOM: 'SAVE_LAYOUT_SETTINGS',

                SET_HIGHLIGHT_TYPE: 'SAVE_HIGHLIGHT_SETTINGS',
                SET_HIGHLIGHT_COLOR: 'SAVE_HIGHLIGHT_SETTINGS',
            },
        },

        INITIALIZING: {
            invoke: {
                src: 'initializerActor',
                onDone: {
                    target: 'IDLE',
                    actions: [
                        assign(({ event }) => ({
                            ...event.output,
                        })),
                        enqueueActions(generateSettingsCSSAction),
                    ],
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

        SAVE_FONT_SETTINGS: {
            invoke: {
                src: 'saveFontSettingsActor',
                input: ({ event, context }) => ({
                    event: event as SettingsStateFontEvents,
                    fontSettings: context.font,
                }),
                onDone: {
                    target: 'IDLE',
                    actions: [
                        assign(({ event }) => ({
                            font: event.output,
                        })),
                        enqueueActions(generateSettingsCSSAction),
                    ],
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
        
        SAVE_LAYOUT_SETTINGS: {
            invoke: {
                src: 'saveLayoutSettingsActor',
                input: ({ event, context }) => ({
                    event: event as SettingsStateLayoutEvents,
                    layoutSettings: context.layout,
                }),
                onDone: {
                    target: 'IDLE',
                    actions: [
                        assign(({ event }) => ({
                            layout: event.output,
                        })),
                        enqueueActions(generateSettingsCSSAction),
                    ],
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

        SAVE_HIGHLIGHT_SETTINGS: {
            invoke: {
                src: 'saveHighlightSettingsActor',
                input: ({ event, context }) => ({
                    event: event as SettingsStateHighlightEvents,
                    highlightSettings: context.highlight,
                }),
                onDone: {
                    target: 'IDLE',
                    actions: [
                        assign(({ event }) => ({
                            highlight: event.output,
                        })),
                        enqueueActions(generateSettingsCSSAction),
                    ],
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
});

export const settingsStateMachineActor = createActor(settingsStateMachine).start();
