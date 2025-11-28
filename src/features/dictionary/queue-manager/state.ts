import { setup, enqueueActions, sendParent } from 'xstate';
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

    on: {
        REQUEST_WORD_ANALYSIS: {
            actions: enqueueActions(({ event, context, enqueue }) => {
                const key = event.highlight.id;
                const existingActor = context.requests[key];
                
                if (existingActor) {
                    enqueue.sendTo(existingActor, { type: 'PROVIDE_UPDATE' });
                } else {
                    enqueue.assign({
                        requests: {
                            ...context.requests,
                            [key]: key,
                        },
                    });
                    enqueue.spawnChild('wordAnalysisRetrieverMachine', {
                        id: key,
                        input: {
                            bookId: event.bookId,
                            highlight: event.highlight,
                            word: event.word,
                            sourceLanguage: event.sourceLanguage,
                            targetLanguage: event.targetLanguage,
                            useAIVoice: event.useAIVoice,
                            showTranslation: event.showTranslation,
                        },
                    });
                }
            }),
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

        QUEUE_MANAGER_WORD_ANALYSIS_UPDATE: {
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
            actions: enqueueActions(({ event, context, enqueue }) => {
                const key = `${event.highlight.id}-image`;
                enqueue.assign({
                    requests: {
                        ...context.requests,
                        [key]: key,
                    },
                });
                enqueue.spawnChild('imageRetrieverMachine', {
                    id: key,
                    input: {
                        word: event.word,
                        highlight: event.highlight,
                    },
                });
            }),
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
            actions: enqueueActions(({ event, context, enqueue }) => {
                const key = `${event.highlight.id}-pronunciation`;
                enqueue.assign({
                    requests: {
                        ...context.requests,
                        [key]: key,
                    },
                });
                enqueue.spawnChild('pronunciationRetrieverMachine', {
                    id: key,
                    input: {
                        word: event.word,
                        highlight: event.highlight,
                    },
                });
            }),
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
            actions: enqueueActions(({ event, context, enqueue }) => {
                const key = `${event.highlight.id}-${event.context.id}`;
                enqueue.assign({
                    requests: {
                        ...context.requests,
                        [key]: key,
                    },
                });
                enqueue.spawnChild('contextAnalysisRetrieverMachine', {
                    id: key,
                    input: {
                        word: event.word,
                        highlight: event.highlight,
                        context: event.context,
                    },
                });
            }),
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
    },
});
