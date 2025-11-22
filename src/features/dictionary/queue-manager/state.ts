import { setup, assign, enqueueActions, sendParent } from 'xstate';
import {
    wordAnalysisRetrieverMachine,
    imageRetrieverMachine,
    pronunciationRetrieverMachine,
    contextAnalysisRetrieverMachine,
} from './actors';
import { deleteRequestAction } from './actions';
import type {
    QueueManagerStateContext,
    QueueManagerStateEvents,
} from './types';

export const queueManagerStateMachine = setup({
    actors: {
        wordAnalysisRetrieverMachine,
        imageRetrieverMachine,
        pronunciationRetrieverMachine,
        contextAnalysisRetrieverMachine,
    },
    types: {
        context: {} as QueueManagerStateContext,
        events: {} as QueueManagerStateEvents,
    }
}).createMachine({
    id: 'DICTIONARY_QUEUE_MANAGER',

    context: {
        requests: {},
    },

    initial: 'IDLE',

    states: {
        IDLE: {
            on: {
                REQUEST_WORD_ANALYSIS: {
                    actions: assign(({ event, context, spawn }) => ({
                        requests: {
                            ...context.requests,
                            [event.word.id]: spawn('wordAnalysisRetrieverMachine', {
                                input: {
                                    bookId: event.bookId,
                                    highlight: event.highlight,
                                    word: event.word,
                                    sourceLanguage: event.sourceLanguage,
                                    targetLanguage: event.targetLanguage,
                                },
                            }),
                        },
                    })),
                },

                QUEUE_MANAGER_WORD_ANALYSIS_TRANSLATION_RETRIEVED: {
                    actions: sendParent(({ event }) => event),
                },

                QUEUE_MANAGER_WORD_ANALYSIS_EXPLANATION_RETRIEVED: {
                    actions: sendParent(({ event }) => event),
                },

                QUEUE_MANAGER_WORD_ANALYSIS_PRONUNCIATION_RETRIEVED: {
                    actions: sendParent(({ event }) => event),
                },

                QUEUE_MANAGER_WORD_ANALYSIS_REQUEST_SUCCESS: {
                    actions: [
                        enqueueActions(deleteRequestAction),
                        sendParent(({ event }) => event),
                    ],
                },
                
                QUEUE_MANAGER_WORD_ANALYSIS_REQUEST_ERROR: {
                    actions: [
                        enqueueActions(deleteRequestAction),
                        sendParent(({ event }) => event),
                    ],
                },

                REQUEST_IMAGE: {
                    actions: assign(({ event, context, spawn }) => ({
                        requests: {
                            ...context.requests,
                            [`${event.word.id}-image`]: spawn('imageRetrieverMachine', {
                                input: {
                                    word: event.word,
                                },
                            }),
                        },
                    })),
                },

                QUEUE_MANAGER_IMAGE_REQUEST_SUCCESS: {
                    actions: [
                        enqueueActions(deleteRequestAction),
                        sendParent(({ event }) => event),
                    ],
                },

                QUEUE_MANAGER_IMAGE_REQUEST_ERROR: {
                    actions: [
                        enqueueActions(deleteRequestAction),
                        sendParent(({ event }) => event),
                    ],
                },

                REQUEST_PRONUNCIATION: {
                    actions: assign(({ event, context, spawn }) => ({
                        requests: {
                            ...context.requests,
                            [`${event.word.id}-pronunciation`]: spawn('pronunciationRetrieverMachine', {
                                input: {
                                    word: event.word,
                                },
                            }),
                        },
                    })),
                },

                QUEUE_MANAGER_PRONUNCIATION_REQUEST_SUCCESS: {
                    actions: [
                        enqueueActions(deleteRequestAction),
                        sendParent(({ event }) => event),
                    ],
                },

                QUEUE_MANAGER_PRONUNCIATION_REQUEST_ERROR: {
                    actions: [
                        enqueueActions(deleteRequestAction),
                        sendParent(({ event }) => event),
                    ],
                },

                REQUEST_CONTEXT_ANALYSIS: {
                    actions: assign(({ event, context, spawn }) => ({
                        requests: {
                            ...context.requests,
                            [`${event.word.id}-${event.context.id}`]: spawn('contextAnalysisRetrieverMachine', {
                                input: {
                                    word: event.word,
                                    context: event.context,
                                },
                            }),
                        },
                    })),
                },

                QUEUE_MANAGER_CONTEXT_ANALYSIS_EXPLANATION_REQUEST_SUCCESS: {
                    actions: sendParent(({ event }) => event),
                },

                QUEUE_MANAGER_CONTEXT_ANALYSIS_REQUEST_SUCCESS: {
                    actions: [
                        enqueueActions(deleteRequestAction),
                        sendParent(({ event }) => event),
                    ],
                },
                
                QUEUE_MANAGER_CONTEXT_ANALYSIS_REQUEST_ERROR: {
                    actions: [
                        enqueueActions(deleteRequestAction),
                        sendParent(({ event }) => event),
                    ],
                },
            }
        },
    },
});
