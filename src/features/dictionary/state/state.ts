import { setup, createActor, assign, sendTo, enqueueActions, raise } from 'xstate';
import { xStateUtils } from 'src/utils';
import {
    queueManagerStateMachine,
    type QueueManagerRequestWordAnalysisEvent,
    type QueueManagerRequestImageEvent,
    type QueueManagerRequestPronunciationEvent,
    type QueueManagerRequestContextAnalysisEvent,
} from '../queue-manager';
import { getNewDictionaryWord } from '../utils';
import {
    initializerActor,
    wordsListChunkRetrievalActor,
    wordRemoverActor,
    wordSearcherActor,
} from './actors';
import {
    updateTranslatingWordAction,
    clearWordSelectionAction,
} from './actions';
import type {
    DictionaryStateContext,
    DictionaryStateEvents,
    ListGetWordsChunkEvent,
    DeleteWordEvent,
    SearchWordEvent,
} from './types';

export const dictionaryStateMachine = setup({
    actors: {
        queueManagerStateMachine,
        initializerActor,
        wordsListChunkRetrievalActor,
        wordRemoverActor,
        wordSearcherActor,
    },
    types: {
        context: {} as DictionaryStateContext,
        events: {} as DictionaryStateEvents,
    }
}).createMachine({
    id: 'DICTIONARY',

    context: {
        storedWords: [],
    },

    entry: assign(({ spawn }) => ({
        queueManagerRef: spawn('queueManagerStateMachine', {
            id: 'queue-manager',
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
                            translatingHighlight: event.highlight,
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
                            useAIVoice: event.useAIVoice,
                            showTranslation: event.showTranslation,
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
                QUEUE_MANAGER_WORD_ANALYSIS_UPDATE: {
                    actions: enqueueActions(updateTranslatingWordAction),
                },
                QUEUE_MANAGER_WORD_ANALYSIS_REQUEST_SUCCESS: {
                    actions: enqueueActions(updateTranslatingWordAction),
                },
                QUEUE_MANAGER_WORD_ANALYSIS_REQUEST_ERROR: {
                    actions: [
                        assign(({ event }) => ({ errorMessage: event.error?.toString() })),
                        raise(({ event }) => ({
                            type: 'DELETE_WORD',
                            wordId: event.word.id,
                        })),
                    ],
                },

                // image
                REQUEST_IMAGE: {
                    actions: sendTo('queue-manager', ({ event }): QueueManagerRequestImageEvent => event),
                },
                QUEUE_MANAGER_IMAGE_REQUEST_SUCCESS: {
                    actions: enqueueActions(updateTranslatingWordAction),
                },
                QUEUE_MANAGER_IMAGE_REQUEST_ERROR: {
                    actions: assign(({ event }) => ({ errorMessage: event.error?.toString() })),
                },

                // pronunciation
                REQUEST_PRONUNCIATION: {
                    actions: sendTo('queue-manager', ({ event }): QueueManagerRequestPronunciationEvent => event),
                },
                QUEUE_MANAGER_PRONUNCIATION_REQUEST_SUCCESS: {
                    actions: enqueueActions(updateTranslatingWordAction),
                },
                QUEUE_MANAGER_PRONUNCIATION_REQUEST_ERROR: {
                    actions: assign(({ event }) => ({ errorMessage: event.error?.toString() })),
                },

                // context (explanation and image in context together)
                REQUEST_CONTEXT_ANALYSIS: {
                    actions: sendTo('queue-manager', ({ event }): QueueManagerRequestContextAnalysisEvent => event),
                },
                QUEUE_MANAGER_CONTEXT_ANALYSIS_EXPLANATION_REQUEST_SUCCESS: {
                    actions: enqueueActions(updateTranslatingWordAction),
                },
                QUEUE_MANAGER_CONTEXT_ANALYSIS_REQUEST_SUCCESS: {
                    actions: enqueueActions(updateTranslatingWordAction),
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
                GET_WORDS_LIST_CHUNK: 'LOADING_WORDS_LIST',
                DELETE_WORD: 'DELETING_WORD',
                SEARCH_WORD: 'SEARCHING_WORDS',
                CLEAR_SEARCH_RESULTS: {
                    actions: assign(() => ({
                        searchWords: undefined,
                        searchWordsCounter: undefined,
                    })),
                },
            },
        },

        INITIALIZING: {
            invoke: {
                src: 'initializerActor',
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

        LOADING_WORDS_LIST: {
            invoke: {
                src: 'wordsListChunkRetrievalActor',
                input: ({ event }) => ({
                    from: (event as ListGetWordsChunkEvent).from,
                    to: (event as ListGetWordsChunkEvent).to,
                }),
                onDone: {
                    target: 'IDLE',
                    actions: assign(({ context, event }) => ({
                        storedWords: [
                            ...context.storedWords,
                            ...event.output.words,
                        ],
                        storedWordsCounter: event.output.counter,
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

        DELETING_WORD: {
            invoke: {
                src: 'wordRemoverActor',
                input: ({ event }) => ({
                    wordId: (event as DeleteWordEvent).wordId,
                }),
                onDone: {
                    target: 'IDLE',
                    actions: assign(({ context, event }) => ({
                        storedWords: context.storedWords.filter(
                            word => word.id !== event.output
                        ),
                        storedWordsCounter: (context.storedWordsCounter ?? 0) - 1,
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

        SEARCHING_WORDS: {
            invoke: {
                src: 'wordSearcherActor',
                input: ({ event }) => ({
                    searchText: (event as SearchWordEvent).searchText,
                }),
                onDone: {
                    target: 'IDLE',
                    actions: assign(({ event }) => ({
                        searchWords: event.output.words,
                        searchWordsCounter: event.output.counter,
                    })),
                },
                onError: {
                    target: 'IDLE',
                    actions: [
                        assign(({ event }) => ({
                            errorMessage: event.error?.toString(),
                            searchWords: [],
                            searchWordsCounter: 0,
                        })),
                        xStateUtils.stateErrorTraceAction,
                    ],
                },
            },
        },
    },

    on: {
        CLEANUP: {
            actions: assign(() => ({
                storedWords: [],
                storedWordsCounter: undefined,
                searchWords: undefined,
                searchWordsCounter: undefined,
            })),
        }
    },
});

export const dictionaryStateMachineActor = createActor(dictionaryStateMachine).start();
