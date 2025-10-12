import { setup, createActor, assign, enqueueActions } from 'xstate';
import { xStateUtils } from 'src/utils';
import { DefaultFontSettings } from '../defaults';
import { initializerActor, saveFontSettingsActor } from './actors';
import { generateSettingsCSSAction } from './actions';
import type {
    SettingsStateContext,
    SettingsStateEvents,
    SettingsStateFontEvents,
} from './types';

export const settingsStateMachine = setup({
    actors: {
        initializerActor,
        saveFontSettingsActor,
    },
    types: {
        context: {} as SettingsStateContext,
        events: {} as SettingsStateEvents,
    }
}).createMachine({
    id: 'SETTINGS',

    context: {
        font: new DefaultFontSettings(),
        settingsCSS: '',
    },

    initial: 'INITIALIZING',

    states: {
        IDLE: {
            on: {
                SET_FONT_SIZE: 'SAVE_FONT_SETTINGS',
                SET_FONT_FAMILY: 'SAVE_FONT_SETTINGS',
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
    },
});

export const settingsStateMachineActor = createActor(settingsStateMachine).start();
