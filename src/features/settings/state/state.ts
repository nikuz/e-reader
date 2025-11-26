import { setup, createActor, assign, enqueueActions } from 'xstate';
import { xStateUtils } from 'src/utils';
import {
    DefaultFontSettings,
    DefaultLayoutSettings,
    DefaultHighlightSettings,
    DefaultDictionarySettings,
} from '../defaults';
import {
    initializerActor,
    fontSettingsSaverActor,
    layoutSettingsSaverActor,
    highlightSettingsSaverActor,
    dictionarySettingsSaverActor,
} from './actors';
import { generateSettingsCSSAction } from './actions';
import type {
    SettingsStateContext,
    SettingsStateEvents,
    SettingsStateFontEvents,
    SettingsStateLayoutEvents,
    SettingsStateHighlightEvents,
    SettingsStateDictionaryEvents,
} from './types';

export const settingsStateMachine = setup({
    actors: {
        initializerActor,
        fontSettingsSaverActor,
        layoutSettingsSaverActor,
        highlightSettingsSaverActor,
        dictionarySettingsSaverActor,
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
        dictionary: new DefaultDictionarySettings(),
        settingsCSS: '',
        fontCSS: '',
        highlightsCSS: '',
    },

    initial: 'INITIALIZING',

    states: {
        IDLE: {
            on: {
                SET_FONT_SIZE: 'SAVING_FONT_SETTINGS',
                SET_FONT_OVERRIDE_BOOK_FONTS: 'SAVING_FONT_SETTINGS',
                SET_FONT_FAMILY: 'SAVING_FONT_SETTINGS',
                SET_FONT_COLOR: 'SAVING_FONT_SETTINGS',
                SET_FONT_LINE_HEIGHT: 'SAVING_FONT_SETTINGS',
                SET_FONT_WORD_SPACING: 'SAVING_FONT_SETTINGS',
                SET_FONT_LETTER_SPACING: 'SAVING_FONT_SETTINGS',

                SET_LAYOUT_PARAGRAPH_MARGIN: 'SAVING_LAYOUT_SETTINGS',
                SET_LAYOUT_MARGIN_LEFT: 'SAVING_LAYOUT_SETTINGS',
                SET_LAYOUT_MARGIN_RIGHT: 'SAVING_LAYOUT_SETTINGS',
                SET_LAYOUT_MARGIN_TOP: 'SAVING_LAYOUT_SETTINGS',
                SET_LAYOUT_MARGIN_BOTTOM: 'SAVING_LAYOUT_SETTINGS',

                SET_HIGHLIGHT_TYPE: 'SAVING_HIGHLIGHT_SETTINGS',
                SET_HIGHLIGHT_COLOR: 'SAVING_HIGHLIGHT_SETTINGS',

                SET_DICTIONARY_VOICE: 'SAVING_DICTIONARY_SETTINGS',
                SET_DICTIONARY_USE_AI_VOICE: 'SAVING_DICTIONARY_SETTINGS',
                SET_DICTIONARY_SHOW_TRANSLATION: 'SAVING_DICTIONARY_SETTINGS',
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

        SAVING_FONT_SETTINGS: {
            invoke: {
                src: 'fontSettingsSaverActor',
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
        
        SAVING_LAYOUT_SETTINGS: {
            invoke: {
                src: 'layoutSettingsSaverActor',
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

        SAVING_HIGHLIGHT_SETTINGS: {
            invoke: {
                src: 'highlightSettingsSaverActor',
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

        SAVING_DICTIONARY_SETTINGS: {
            invoke: {
                src: 'dictionarySettingsSaverActor',
                input: ({ event, context }) => ({
                    event: event as SettingsStateDictionaryEvents,
                    dictionarySettings: context.dictionary,
                }),
                onDone: {
                    target: 'IDLE',
                    actions: assign(({ event }) => ({
                        dictionary: event.output,
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
});

export const settingsStateMachineActor = createActor(settingsStateMachine).start();
