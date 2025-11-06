import { setup, assign, enqueueActions, sendParent } from 'xstate';
import { DatabaseController } from 'src/controllers';
import type { DictionaryWord } from '../types';
import { wordAnalysisRetrieverMachine, imageRetrieverMachine } from './actors';
import { deleteRequestAction } from './actions';
import type {
    QueueManagerStateContext,
    QueueManagerStateEvents,
} from './types';

interface InputParameters {
    dbController: DatabaseController<DictionaryWord>,
}

export const queueManagerStateMachine = setup({
    actors: {
        wordAnalysisRetrieverMachine,
        imageRetrieverMachine,
    },
    types: {
        context: {} as QueueManagerStateContext,
        events: {} as QueueManagerStateEvents,
        input: {} as InputParameters,
    }
}).createMachine({
    id: 'DICTIONARY_QUEUE_MANAGER',

    context: ({ input }) => ({
        ...input,
        requests: {},
    }),

    initial: 'IDLE',

    states: {
        IDLE: {
            on: {
                REQUEST_WORD_ANALYSIS: {
                    actions: assign(({ event, context, spawn }) => ({
                        requests: {
                            ...context.requests,
                            [event.highlight.id]: spawn('wordAnalysisRetrieverMachine', {
                                input: {
                                    dbController: context.dbController,
                                    highlight: event.highlight,
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
                            [event.highlight.id]: spawn('imageRetrieverMachine', {
                                input: {
                                    dbController: context.dbController,
                                    word: event.word,
                                    highlight: event.highlight,
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
            }
        },
    },
});
