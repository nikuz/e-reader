import { setup, createActor, assign, sendTo } from 'xstate';
import { DatabaseController } from 'src/controllers';
import { xStateUtils } from 'src/utils';
import { queueManagerStateMachine } from '../queue-manager';
import { getNewDictionaryWord } from '../utils';
import { DICTIONARY_DB_CONFIG } from '../constants';
import type { DictionaryWord } from '../types';
import {
    initializerActor,
} from './actors';
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
        dbController: new DatabaseController<DictionaryWord>(DICTIONARY_DB_CONFIG),
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
                            translatingWord: getNewDictionaryWord({ highlight: event.highlight }),
                        })),
                        sendTo('queue-manager', ({ event }) => event),
                    ],
                },
                QUEUE_MANAGER_WORD_ANALYSIS_TRANSLATION_RETRIEVED: {
                    actions: assign(({ context, event }) => ({
                        translatingWord: context.translatingWord && {
                            ...context.translatingWord,
                            translation: event.translation,
                        }
                    })),
                },
                QUEUE_MANAGER_WORD_ANALYSIS_EXPLANATION_RETRIEVED: {
                    actions: assign(({ context, event }) => ({
                        translatingWord: context.translatingWord && {
                            ...context.translatingWord,
                            aiExplanation: event.explanation,
                        }
                    })),
                },
                QUEUE_MANAGER_WORD_ANALYSIS_PRONUNCIATION_RETRIEVED: {
                    actions: assign(({ context, event }) => ({
                        translatingWord: context.translatingWord && {
                            ...context.translatingWord,
                            aiPronunciation: event.pronunciation,
                        }
                    })),
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
    },
});

export const dictionaryStateMachineActor = createActor(dictionaryStateMachine).start();
