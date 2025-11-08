import { setup, createActor, assign, sendTo, enqueueActions } from 'xstate';
import { DatabaseController } from 'src/controllers';
import { xStateUtils } from 'src/utils';
import { queueManagerStateMachine } from '../queue-manager';
import { getNewDictionaryWord } from '../utils';
import { DICTIONARY_DB_CONFIG } from '../constants';
import { initializerActor } from './actors';
import { updateTranslatingWordAction } from './actions';
import type {
    DictionaryStateContext,
    DictionaryStateEvents,
} from './types';

export const dictionaryStateMachine = setup({
    actors: {
        queueManagerStateMachine,
        initializerActor,
    },
    types: {
        context: {} as DictionaryStateContext,
        events: {} as DictionaryStateEvents,
    }
}).createMachine({
    id: 'DICTIONARY',

    context: {
        dbController: new DatabaseController(DICTIONARY_DB_CONFIG),
        storedWords: [],
    },

    entry: assign(({ context, spawn }) => ({
        queueManagerRef: spawn('queueManagerStateMachine', {
            id: 'queue-manager',
            input: {
                dbController: context.dbController,
            },
        }),
    })),

    initial: 'INITIALIZING',

    states: {
        IDLE: {
            on: {
                REQUEST_WORD_ANALYSIS: {
                    actions: [
                        assign(({ event }) => ({
                            translatingWord: getNewDictionaryWord({
                                highlight: event.highlight,
                                sourceLanguage: event.sourceLanguage,
                                targetLanguage: event.targetLanguage,
                            }),
                        })),
                        sendTo('queue-manager', ({ context, event }) => ({
                            type: event.type,
                            highlight: event.highlight,
                            word: context.translatingWord,
                            sourceLanguage: event.sourceLanguage,
                            targetLanguage: event.targetLanguage,
                        })),
                    ],
                },
                QUEUE_MANAGER_WORD_ANALYSIS_TRANSLATION_RETRIEVED: {
                    actions: enqueueActions(updateTranslatingWordAction),
                },
                QUEUE_MANAGER_WORD_ANALYSIS_EXPLANATION_RETRIEVED: {
                    actions: enqueueActions(updateTranslatingWordAction),
                },
                QUEUE_MANAGER_WORD_ANALYSIS_PRONUNCIATION_RETRIEVED: {
                    actions: enqueueActions(updateTranslatingWordAction),
                },
                QUEUE_MANAGER_WORD_ANALYSIS_REQUEST_SUCCESS: {
                    actions: assign(({ event }) => ({
                        translatingWord: undefined,
                        selectedWord: event.word,
                    })),
                },
                QUEUE_MANAGER_WORD_ANALYSIS_REQUEST_ERROR: {
                    actions: assign(() => ({ translatingWord: undefined })),
                },
                REQUEST_IMAGE: {
                    actions: sendTo('queue-manager', ({ event }) => event),
                },
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
