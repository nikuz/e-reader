import { setup, sendParent, assign } from 'xstate';
import { xStateUtils } from 'src/utils';
import type { BookHighlight } from 'src/types';
import {
    DICTIONARY_QUEUE_MANAGER_RETRY_TIMEOUT,
    DICTIONARY_QUEUE_MANAGER_RETRY_ATTEMPT,
} from '../../../constants';
import type { DictionaryWord, Language } from '../../../types';
import type {
    QueueManagerWordAnalysisTranslationRetrievedEvent,
    QueueManagerWordAnalysisExplanationRetrievedEvent,
    QueueManagerWordAnalysisPronunciationRetrievedEvent,
    QueueManagerWordAnalysisUpdateEvent,
    QueueManagerWordAnalysisRequestSuccessEvent,
    QueueManagerWordAnalysisRequestErrorEvent,
} from '../../types';
import { dbRetrieverActor } from './db-retriever-actor';
import { dbUpsertActor } from './db-upsert-actor';
import { translationActor } from './translation-actor';
import { explanationActor } from './explanation-actor';
import { pronunciationActor } from './pronunciation-actor';

interface InputParameters {
    bookId: string,
    word: DictionaryWord,
    highlight: BookHighlight,
    sourceLanguage: Language,
    targetLanguage: Language,
}

export const wordAnalysisRetrieverMachine = setup({
    actors: {
        dbRetrieverActor,
        dbUpsertActor,
        translationActor,
        explanationActor,
        pronunciationActor,
    },
    types: {
        context: {} as InputParameters & {
            translation?: string,
            translationRetrieveAttempt: number,
            explanation?: string,
            explanationRetrieveAttempt: number,
            pronunciation?: string,
            pronunciationRetrieveAttempt: number,
        },
        input: {} as InputParameters,
        events: {} as { type: 'PROVIDE_UPDATE' }
    }
}).createMachine({
    id: 'DICTIONARY_QUEUE_MANAGER_WORD_ANALYSIS_RETRIEVER',

    context: ({ input }) => ({
        ...input,
        translationRetrieveAttempt: 0,
        explanationRetrieveAttempt: 0,
        pronunciationRetrieveAttempt: 0,
    }),

    initial: 'RETRIEVING_FROM_DB',

    states: {
        RETRIEVING_FROM_DB: {
            invoke: {
                src: 'dbRetrieverActor',
                input: ({ context }) => ({
                    word: context.word,
                }),
                onDone: [
                    {
                        guard: ({ event }) => !!event.output,
                        actions: [
                            sendParent(({ context, event }): QueueManagerWordAnalysisRequestSuccessEvent => ({
                                type: 'QUEUE_MANAGER_WORD_ANALYSIS_REQUEST_SUCCESS',
                                word: event.output!,
                                highlight: context.highlight,
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
                            word: context.word,
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
                                input: ({ context }) => ({ word: context.word }),
                                onDone: {
                                    target: 'SAVING_TO_DB',
                                    actions: [
                                        assign(({ event }) => ({
                                            translation: event.output,
                                        })),
                                        sendParent(({ context, event }): QueueManagerWordAnalysisTranslationRetrievedEvent => ({
                                            type: 'QUEUE_MANAGER_WORD_ANALYSIS_TRANSLATION_RETRIEVED',
                                            word: context.word,
                                            highlight: context.highlight,
                                            translation: event.output,
                                        })),
                                    ],
                                },
                                onError: [
                                    {
                                        guard: ({ context }) => context.translationRetrieveAttempt < DICTIONARY_QUEUE_MANAGER_RETRY_ATTEMPT,
                                        target: 'RETRYING',
                                        actions: assign(({ context }) => ({ translationRetrieveAttempt: context.translationRetrieveAttempt + 1 })),
                                    },
                                    {
                                        target: 'ERROR',
                                        actions: xStateUtils.stateErrorTraceAction,
                                    }
                                ],
                            },
                        },
                        RETRYING: {
                            after: {
                                [DICTIONARY_QUEUE_MANAGER_RETRY_TIMEOUT]: 'LOADING',
                            },
                        },
                        SAVING_TO_DB: {
                            invoke: {
                                src: 'dbUpsertActor',
                                input: ({ context }) => ({
                                    bookId: context.bookId,
                                    highlight: context.highlight,
                                    translation: context.translation,
                                    explanation: context.explanation,
                                    pronunciation: context.pronunciation,
                                    sourceLanguage: context.sourceLanguage,
                                    targetLanguage: context.targetLanguage,
                                }),
                                onDone: {
                                    target: 'SUCCESS',
                                },
                                onError: {
                                    target: 'SUCCESS',
                                    actions: xStateUtils.stateErrorTraceAction,
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
                                input: ({ context }) => ({ word: context.word }),
                                onDone: {
                                    target: 'SAVING_TO_DB',
                                    actions: [
                                        assign(({ event }) => ({
                                            explanation: event.output,
                                        })),
                                        sendParent(({ context, event }): QueueManagerWordAnalysisExplanationRetrievedEvent => ({
                                            type: 'QUEUE_MANAGER_WORD_ANALYSIS_EXPLANATION_RETRIEVED',
                                            word: context.word,
                                            highlight: context.highlight,
                                            explanation: event.output,
                                        })),
                                    ],
                                },
                                onError: [
                                    {
                                        guard: ({ context }) => context.explanationRetrieveAttempt < DICTIONARY_QUEUE_MANAGER_RETRY_ATTEMPT,
                                        target: 'RETRYING',
                                        actions: assign(({ context }) => ({ explanationRetrieveAttempt: context.explanationRetrieveAttempt + 1 })),
                                    },
                                    {
                                        target: 'ERROR',
                                        actions: xStateUtils.stateErrorTraceAction,
                                    }
                                ],
                            },
                        },
                        RETRYING: {
                            after: {
                                [DICTIONARY_QUEUE_MANAGER_RETRY_TIMEOUT]: 'LOADING',
                            },
                        },
                        SAVING_TO_DB: {
                            invoke: {
                                src: 'dbUpsertActor',
                                input: ({ context }) => ({
                                    bookId: context.bookId,
                                    highlight: context.highlight,
                                    translation: context.translation,
                                    explanation: context.explanation,
                                    pronunciation: context.pronunciation,
                                    sourceLanguage: context.sourceLanguage,
                                    targetLanguage: context.targetLanguage,
                                }),
                                onDone: {
                                    target: 'SUCCESS',
                                },
                                onError: {
                                    target: 'SUCCESS',
                                    actions: xStateUtils.stateErrorTraceAction,
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
                                input: ({ context }) => ({ word: context.word }),
                                onDone: {
                                    target: 'SAVING_TO_DB',
                                    actions: [
                                        assign(({ event }) => ({
                                            pronunciation: event.output,
                                        })),
                                        sendParent(({ context, event }): QueueManagerWordAnalysisPronunciationRetrievedEvent => ({
                                            type: 'QUEUE_MANAGER_WORD_ANALYSIS_PRONUNCIATION_RETRIEVED',
                                            word: context.word,
                                            highlight: context.highlight,
                                            pronunciation: event.output,
                                        })),
                                    ],
                                },
                                onError: [
                                    {
                                        guard: ({ context }) => context.pronunciationRetrieveAttempt < DICTIONARY_QUEUE_MANAGER_RETRY_ATTEMPT,
                                        target: 'RETRYING',
                                        actions: assign(({ context }) => ({ pronunciationRetrieveAttempt: context.pronunciationRetrieveAttempt + 1 })),
                                    },
                                    {
                                        target: 'ERROR',
                                        actions: xStateUtils.stateErrorTraceAction,
                                    }
                                ],
                            },
                        },
                        RETRYING: {
                            after: {
                                [DICTIONARY_QUEUE_MANAGER_RETRY_TIMEOUT]: 'LOADING',
                            },
                        },
                        SAVING_TO_DB: {
                            invoke: {
                                src: 'dbUpsertActor',
                                input: ({ context }) => ({
                                    bookId: context.bookId,
                                    highlight: context.highlight,
                                    translation: context.translation,
                                    explanation: context.explanation,
                                    pronunciation: context.pronunciation,
                                    sourceLanguage: context.sourceLanguage,
                                    targetLanguage: context.targetLanguage,
                                }),
                                onDone: {
                                    target: 'SUCCESS',
                                },
                                onError: {
                                    target: 'SUCCESS',
                                    actions: xStateUtils.stateErrorTraceAction,
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
                    guard: ({ context }) => context.translation !== undefined || context.explanation !== undefined,
                    target: '#DICTIONARY_QUEUE_MANAGER_WORD_ANALYSIS_RETRIEVER.RETRIEVING_FINAL_WORD',
                },
                {
                    actions: sendParent(({ context }): QueueManagerWordAnalysisRequestErrorEvent => ({
                        type: 'QUEUE_MANAGER_WORD_ANALYSIS_REQUEST_ERROR',
                        word: context.word,
                        highlight: context.highlight,
                        error: new Error('Can\'t retrieve word analysis'),
                    })),
                },
            ],
        },

        RETRIEVING_FINAL_WORD: {
            invoke: {
                src: 'dbRetrieverActor',
                input: ({ context }) => ({
                    word: context.word,
                }),
                onDone: [
                    {
                        guard: ({ event }) => event.output !== undefined,
                        actions: sendParent(({ context, event }): QueueManagerWordAnalysisRequestSuccessEvent => ({
                            type: 'QUEUE_MANAGER_WORD_ANALYSIS_REQUEST_SUCCESS',
                            word: event.output!,
                            highlight: context.highlight,
                        })),
                    },
                    {
                        actions: sendParent(({ context }): QueueManagerWordAnalysisRequestErrorEvent => ({
                            type: 'QUEUE_MANAGER_WORD_ANALYSIS_REQUEST_ERROR',
                            word: context.word,
                            highlight: context.highlight,
                            error: new Error('Can\'t retrieve final word from local DB'),
                        })),
                    }
                ],
                onError: {
                    actions: [
                        xStateUtils.stateErrorTraceAction,
                        sendParent(({ context }): QueueManagerWordAnalysisRequestErrorEvent => ({
                            type: 'QUEUE_MANAGER_WORD_ANALYSIS_REQUEST_ERROR',
                            word: context.word,
                            highlight: context.highlight,
                            error: new Error('Can\'t retrieve final word from local DB'),
                        })),
                    ],
                },
            },
        },
    },

    on: {
        PROVIDE_UPDATE: {
            actions: sendParent(({ context }): QueueManagerWordAnalysisUpdateEvent => ({
                type: 'QUEUE_MANAGER_WORD_ANALYSIS_UPDATE',
                word: context.word,
                highlight: context.highlight,
                translation: context.translation,
                explanation: context.explanation,
                pronunciation: context.pronunciation,
            })),
        },
    }
});
