import { setup, sendParent, assign } from 'xstate';
import { DatabaseController } from 'src/controllers';
import { xStateUtils } from 'src/utils';
import type { BookHighlight } from 'src/types';
import type { DictionaryWord, Language } from '../../../types';
import type {
    QueueManagerWordAnalysisTranslationRetrievedEvent,
    QueueManagerWordAnalysisExplanationRetrievedEvent,
    QueueManagerWordAnalysisPronunciationRetrievedEvent,
    QueueManagerWordAnalysisRequestSuccessEvent,
    QueueManagerWordAnalysisRequestErrorEvent,
} from '../../types';
import { dbRetrieverActor } from './db-retriever-actor';
import { dbSaverActor } from './db-saver-actor';
import { translationActor } from './translation-actor';
import { explanationActor } from './explanation-actor';
import { pronunciationActor } from './pronunciation-actor';

interface InputParameters {
    dbController: DatabaseController,
    highlight: BookHighlight,
    word: DictionaryWord,
    sourceLanguage: Language,
    targetLanguage: Language,
}

export const wordAnalysisRetrieverMachine = setup({
    actors: {
        dbRetrieverActor,
        dbSaverActor,
        translationActor,
        explanationActor,
        pronunciationActor,
    },
    types: {
        context: {} as InputParameters & {
            translation?: string,
            explanation?: string,
            pronunciation?: string,
        },
        input: {} as InputParameters,
    }
}).createMachine({
    id: 'DICTIONARY_QUEUE_MANAGER_WORD_ANALYSIS_RETRIEVER',

    context: ({ input }) => input,

    initial: 'RETRIEVING_FROM_DB',

    states: {
        RETRIEVING_FROM_DB: {
            invoke: {
                src: 'dbRetrieverActor',
                input: ({ context }) => ({
                    dbController: context.dbController,
                    highlight: context.highlight,
                    sourceLanguage: context.sourceLanguage,
                    targetLanguage: context.targetLanguage,
                }),
                onDone: [
                    {
                        guard: ({ event }) => !!event.output,
                        actions: [
                            sendParent(({ context, event }): QueueManagerWordAnalysisRequestSuccessEvent => ({
                                type: 'QUEUE_MANAGER_WORD_ANALYSIS_REQUEST_SUCCESS',
                                highlight: context.highlight,
                                word: event.output!,
                            })),
                        ],
                    },
                    {
                        target: 'RETRIEVING_FROM_CLOUD',
                    }
                ],
                onError: {
                    actions: [
                        xStateUtils.stateErrorTraceAction,
                        sendParent(({ context }): QueueManagerWordAnalysisRequestErrorEvent => ({
                            type: 'QUEUE_MANAGER_WORD_ANALYSIS_REQUEST_ERROR',
                            highlight: context.highlight,
                            error: new Error('Can\'t retrieve word from local DB'),
                        }))
                    ],
                },
            },
        },

        RETRIEVING_FROM_CLOUD: {
            type: 'parallel',

            states: {
                RETRIEVING_TRANSLATION: {
                    initial: 'LOADING',
                    states: {
                        LOADING: {
                            invoke: {
                                src: 'translationActor',
                                input: ({ context }) => ({
                                    highlight: context.highlight,
                                    sourceLanguage: context.sourceLanguage,
                                    targetLanguage: context.targetLanguage,
                                }),
                                onDone: {
                                    target: 'SUCCESS',
                                    actions: [
                                        assign(({ event }) => ({
                                            translation: event.output,
                                        })),
                                        sendParent(({ context, event }): QueueManagerWordAnalysisTranslationRetrievedEvent => ({
                                            type: 'QUEUE_MANAGER_WORD_ANALYSIS_TRANSLATION_RETRIEVED',
                                            highlight: context.highlight,
                                            translation: event.output,
                                        })),
                                    ],
                                },
                                onError: {
                                    target: 'ERROR',
                                    actions: [
                                        xStateUtils.stateErrorTraceAction,
                                    ],
                                },
                            },
                        },
                        SUCCESS: { type: 'final' },
                        ERROR: { type: 'final' }
                    }
                },

                RETRIEVING_EXPLANATION: {
                    initial: 'LOADING',
                    states: {
                        LOADING: {
                            invoke: {
                                src: 'explanationActor',
                                input: ({ context }) => ({
                                    highlight: context.highlight,
                                    sourceLanguage: context.sourceLanguage,
                                    targetLanguage: context.targetLanguage,
                                }),
                                onDone: {
                                    target: 'SUCCESS',
                                    actions: [
                                        assign(({ event }) => ({
                                            explanation: event.output,
                                        })),
                                        sendParent(({ context, event }): QueueManagerWordAnalysisExplanationRetrievedEvent => ({
                                            type: 'QUEUE_MANAGER_WORD_ANALYSIS_EXPLANATION_RETRIEVED',
                                            highlight: context.highlight,
                                            explanation: event.output,
                                        })),
                                    ],
                                },
                                onError: {
                                    target: 'ERROR',
                                    actions: [
                                        xStateUtils.stateErrorTraceAction,
                                    ],
                                },
                            },
                        },
                        SUCCESS: { type: 'final' },
                        ERROR: { type: 'final' }
                    }
                },

                RETRIEVING_PRONUNCIATION: {
                    initial: 'LOADING',
                    states: {
                        LOADING: {
                            invoke: {
                                src: 'pronunciationActor',
                                input: ({ context }) => ({
                                    highlight: context.highlight,
                                    sourceLanguage: context.sourceLanguage,
                                }),
                                onDone: {
                                    target: 'SUCCESS',
                                    actions: [
                                        assign(({ event }) => ({
                                            pronunciation: event.output,
                                        })),
                                        sendParent(({ context, event }): QueueManagerWordAnalysisPronunciationRetrievedEvent => ({
                                            type: 'QUEUE_MANAGER_WORD_ANALYSIS_PRONUNCIATION_RETRIEVED',
                                            highlight: context.highlight,
                                            pronunciation: event.output,
                                        })),
                                    ],
                                },
                                onError: {
                                    target: 'ERROR',
                                    actions: [
                                        xStateUtils.stateErrorTraceAction,
                                    ],
                                },
                            },
                        },
                        SUCCESS: { type: 'final' },
                        ERROR: { type: 'final' }
                    }
                },
            },

            onDone: [
                {
                    guard: ({ context }) => context.translation !== undefined && context.explanation !== undefined,
                    target: '#DICTIONARY_QUEUE_MANAGER_WORD_ANALYSIS_RETRIEVER.SAVING_TO_DB',
                },
                {
                    actions: sendParent(({ context }): QueueManagerWordAnalysisRequestErrorEvent => ({
                        type: 'QUEUE_MANAGER_WORD_ANALYSIS_REQUEST_ERROR',
                        highlight: context.highlight,
                        error: new Error('Can\'t retrieve word analysis'),
                    })),
                },
            ],
        },

        SAVING_TO_DB: {
            invoke: {
                src: 'dbSaverActor',
                input: ({ context }) => ({
                    dbController: context.dbController,
                    highlight: context.highlight,
                    translation: context.translation,
                    explanation: context.explanation,
                    pronunciation: context.pronunciation,
                    sourceLanguage: context.sourceLanguage,
                    targetLanguage: context.targetLanguage,
                }),
                onDone: {
                    actions: sendParent(({ context, event }): QueueManagerWordAnalysisRequestSuccessEvent => ({
                        type: 'QUEUE_MANAGER_WORD_ANALYSIS_REQUEST_SUCCESS',
                        highlight: context.highlight,
                        word: event.output,
                    })),
                },
                onError: {
                    actions: [
                        xStateUtils.stateErrorTraceAction,
                        sendParent(({ context }): QueueManagerWordAnalysisRequestErrorEvent => ({
                            type: 'QUEUE_MANAGER_WORD_ANALYSIS_REQUEST_ERROR',
                            highlight: context.highlight,
                            error: new Error('Can\'t save word to local DB'),
                        }))
                    ],
                },
            },
        }
    },
});
