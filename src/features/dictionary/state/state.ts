import { setup, createActor, assign, sendTo, enqueueActions } from 'xstate';
import { DatabaseController } from 'src/controllers';
import { xStateUtils } from 'src/utils';
import {
    queueManagerStateMachine,
    type QueueManagerRequestWordAnalysisEvent,
    type QueueManagerRequestImageEvent,
    type QueueManagerRequestPronunciationEvent,
    type QueueManagerRequestContextAnalysisEvent,
} from '../queue-manager';
import { getNewDictionaryWord } from '../utils';
import { DICTIONARY_DB_CONFIG } from '../constants';
import { initializerActor, databaseCleanerActor } from './actors';
import {
    updateTranslatingWordAction,
    clearWordSelectionAction,
    updateSelectedWordAction,
} from './actions';
import type {
    DictionaryStateContext,
    DictionaryStateEvents,
} from './types';

export const dictionaryStateMachine = setup({
    actors: {
        queueManagerStateMachine,
        initializerActor,
        databaseCleanerActor,
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
                // analysis (translation, explanation, and pronunciation together)
                REQUEST_WORD_ANALYSIS: {
                    actions: [
                        assign(({ event }) => ({
                            translatingWord: getNewDictionaryWord({
                                bookId: event.bookId,
                                highlight: event.highlight,
                                sourceLanguage: event.sourceLanguage,
                                targetLanguage: event.targetLanguage,
                            }),
                        })),
                        sendTo('queue-manager', ({ context, event }): QueueManagerRequestWordAnalysisEvent => ({
                            type: event.type,
                            bookId: event.bookId,
                            highlight: event.highlight,
                            word: context.translatingWord!,
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
                    actions: assign(({ event }) => ({ errorMessage: event.error?.toString() })),
                },

                // image
                REQUEST_IMAGE: {
                    actions: sendTo('queue-manager', ({ event }): QueueManagerRequestImageEvent => event),
                },
                QUEUE_MANAGER_IMAGE_REQUEST_SUCCESS: {
                    actions: enqueueActions(updateSelectedWordAction),
                },
                QUEUE_MANAGER_IMAGE_REQUEST_ERROR: {
                    actions: assign(({ event }) => ({ errorMessage: event.error?.toString() })),
                },

                // pronunciation
                REQUEST_PRONUNCIATION: {
                    actions: sendTo('queue-manager', ({ event }): QueueManagerRequestPronunciationEvent => event),
                },
                QUEUE_MANAGER_PRONUNCIATION_REQUEST_SUCCESS: {
                    actions: enqueueActions(updateSelectedWordAction),
                },
                QUEUE_MANAGER_PRONUNCIATION_REQUEST_ERROR: {
                    actions: assign(({ event }) => ({ errorMessage: event.error?.toString() })),
                },

                // context (explanation and image in context together)
                REQUEST_CONTEXT_ANALYSIS: {
                    actions: sendTo('queue-manager', ({ event }): QueueManagerRequestContextAnalysisEvent => event),
                },
                QUEUE_MANAGER_CONTEXT_ANALYSIS_EXPLANATION_REQUEST_SUCCESS: {
                    actions: enqueueActions(updateSelectedWordAction),
                },
                QUEUE_MANAGER_CONTEXT_ANALYSIS_REQUEST_SUCCESS: {
                    actions: enqueueActions(updateSelectedWordAction),
                },
                QUEUE_MANAGER_CONTEXT_ANALYSIS_REQUEST_ERROR: {
                    actions: assign(({ event }) => ({ errorMessage: event.error?.toString() })),
                },

                CLEAR_WORD_SELECTION: {
                    actions: enqueueActions(clearWordSelectionAction),
                },
                CLEAR_ERROR_MESSAGE: {
                    actions: assign(() => ({ errorMessage: undefined })),
                },
                CLEAR_DATABASE: 'CLEARING_DATABASE',
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

        CLEARING_DATABASE: {
            invoke: {
                src: 'databaseCleanerActor',
                input: ({ context }) => ({
                    dbController: context.dbController,
                }),
            },
        },
    },
});

export const dictionaryStateMachineActor = createActor(dictionaryStateMachine).start();
