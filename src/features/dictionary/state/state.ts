import { setup, createActor, assign } from 'xstate';
import { DatabaseController } from 'src/controllers';
import { xStateUtils } from 'src/utils';
import { DICTIONARY_DB_CONFIG } from '../constants';
import type { DictionaryWord } from '../types';
import {
    initializerActor,
    translationRetrieverActor,
} from './actors';
import type {
    DictionaryStateContext,
    DictionaryStateEvents,
    RequestTranslationAction,
} from './types';

export const dictionaryStateMachine = setup({
    actors: {
        initializerActor,
        translationRetrieverActor,
    },
    types: {
        context: {} as DictionaryStateContext,
        events: {} as DictionaryStateEvents,
    }
}).createMachine({
    id: 'DICTIONARY',

    context: {
        dbController: new DatabaseController<DictionaryWord>(DICTIONARY_DB_CONFIG),
        storedWords: [],
    },

    initial: 'INITIALIZING',

    states: {
        IDLE: {
            on: {
                REQUEST_TRANSLATION: 'TRANSLATING',
            },
        },

        INITIALIZING: {
            invoke: {
                src: 'initializerActor',
                input: ({ context }) => ({
                    dbController: context.dbController,
                }),
                onDone: {
                    target: 'IDLE',
                    actions: assign(({ event }) => ({
                        storedWords: event.output,
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

        TRANSLATING: {
            invoke: {
                src: 'translationRetrieverActor',
                input: ({ event, context }) => ({
                    dbController: context.dbController,
                    highlight: (event as RequestTranslationAction).highlight,
                }),
                onDone: {
                    target: 'IDLE',
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

export const dictionaryStateMachineActor = createActor(dictionaryStateMachine).start();
