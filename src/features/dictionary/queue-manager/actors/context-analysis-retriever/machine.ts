import { setup, sendParent, assign } from 'xstate';
import { DatabaseController } from 'src/controllers';
import { xStateUtils, converterUtils } from 'src/utils';
import type { BookHighlight } from 'src/types';
import type {
    DictionaryWord,
    DictionaryWordContext,
    DictionaryWordContextExplanation,
    DictionaryWordContextImage,
} from '../../../types';
import type {
    QueueManagerContextAnalysisRequestSuccessEvent,
    QueueManagerContextAnalysisRequestErrorEvent,
} from '../../types';
import { explanationActor } from './explanation-actor';
import { imageActor } from './image-actor';
import { dbSaverActor } from './db-saver-actor';

interface InputParameters {
    dbController: DatabaseController,
    word: DictionaryWord,
    highlight: BookHighlight,
    style?: string,
}

export const contextAnalysisRetrieverMachine = setup({
    actors: {
        explanationActor,
        imageActor,
        dbSaverActor,
    },
    types: {
        context: {} as InputParameters & {
            newContext: DictionaryWordContext,
            contextExplanation?: DictionaryWordContextExplanation,
            contextImage?: DictionaryWordContextImage,
        },
        input: {} as InputParameters,
    }
}).createMachine({
    id: 'DICTIONARY_QUEUE_MANAGER_CONTEXT_ANALYSIS_RETRIEVER',

    context: ({ input }) => ({
        ...input,
        newContext: {
            id: converterUtils.stringToHash(input.highlight.context),
            text: input.highlight.context,
        },
    }),

    initial: 'RETRIEVING_EXPLANATION',

    states: {
        RETRIEVING_EXPLANATION: {
            invoke: {
                src: 'explanationActor',
                input: ({ context }) => ({
                    word: context.word,
                    newContext: context.newContext,
                    highlight: context.highlight,
                }),
                onDone: {
                    target: 'RETRIEVING_IMAGE',
                    actions: assign(({ event }) => ({ contextExplanation: event.output })),
                },
                onError: {
                    actions: [
                        xStateUtils.stateErrorTraceAction,
                        sendParent(({ context }): QueueManagerContextAnalysisRequestErrorEvent => ({
                            type: 'QUEUE_MANAGER_CONTEXT_ANALYSIS_REQUEST_ERROR',
                            word: context.word,
                            error: new Error('Can\'t retrieve word context analysis'),
                        })),
                    ],
                },
            },
        },

        RETRIEVING_IMAGE: {
            invoke: {
                src: 'imageActor',
                input: ({ context }) => ({
                    word: context.word,
                    contextExplanation: context.contextExplanation,
                    newContext: context.newContext,
                    style: context.style,
                }),
                onDone: {
                    target: 'SAVING_TO_DB',
                    actions: assign(({ event }) => ({ contextImage: event.output })),
                },
                onError: {
                    actions: [
                        xStateUtils.stateErrorTraceAction,
                        sendParent(({ context }): QueueManagerContextAnalysisRequestErrorEvent => ({
                            type: 'QUEUE_MANAGER_CONTEXT_ANALYSIS_REQUEST_ERROR',
                            word: context.word,
                            error: new Error('Can\'t retrieve word context image'),
                        })),
                    ],
                },
            },
        },

        SAVING_TO_DB: {
            invoke: {
                src: 'dbSaverActor',
                input: ({ context }) => ({
                    dbController: context.dbController,
                    word: context.word,
                    newContext: context.newContext,
                    contextExplanation: context.contextExplanation,
                    contextImage: context.contextImage,
                }),
                onDone: {
                    actions: sendParent(({ event }): QueueManagerContextAnalysisRequestSuccessEvent => ({
                        type: 'QUEUE_MANAGER_CONTEXT_ANALYSIS_REQUEST_SUCCESS',
                        word: event.output,
                    })),
                },
                onError: {
                    actions: [
                        xStateUtils.stateErrorTraceAction,
                        sendParent(({ context }): QueueManagerContextAnalysisRequestErrorEvent => ({
                            type: 'QUEUE_MANAGER_CONTEXT_ANALYSIS_REQUEST_ERROR',
                            word: context.word,
                            error: new Error('Can\'t update word context explanation in local DB'),
                        }))
                    ],
                },
            },
        }
    },
});
