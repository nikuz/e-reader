import { setup, sendParent, assign } from 'xstate';
import { xStateUtils } from 'src/utils';
import type {
    DictionaryWord,
    DictionaryWordContext,
    DictionaryWordContextExplanation,
    DictionaryWordContextImage,
} from '../../../types';
import type {
    QueueManagerContextAnalysisRequestSuccessEvent,
    QueueManagerContextAnalysisExplanationRequestSuccessEvent,
    QueueManagerContextAnalysisRequestErrorEvent,
} from '../../types';
import { explanationActor } from './explanation-actor';
import { imageActor } from './image-actor';
import { explanationSaverActor } from './explanation-saver-actor';
import { imageSaverActor } from './image-saver-actor';

interface InputParameters {
    word: DictionaryWord,
    context: DictionaryWordContext,
    style?: string,
}

export const contextAnalysisRetrieverMachine = setup({
    actors: {
        explanationActor,
        explanationSaverActor,
        imageActor,
        imageSaverActor,
    },
    types: {
        context: {} as InputParameters & {
            context: DictionaryWordContext,
            contextExplanation?: DictionaryWordContextExplanation,
            contextImage?: DictionaryWordContextImage,
        },
        input: {} as InputParameters,
    }
}).createMachine({
    id: 'DICTIONARY_QUEUE_MANAGER_CONTEXT_ANALYSIS_RETRIEVER',

    context: ({ input }) => input,

    initial: 'RETRIEVING_EXPLANATION',

    states: {
        RETRIEVING_EXPLANATION: {
            invoke: {
                src: 'explanationActor',
                input: ({ context }) => ({
                    word: context.word,
                    context: context.context,
                }),
                onDone: {
                    target: 'SAVING_EXPLANATION',
                    actions: assign(({ event }) => ({ contextExplanation: event.output })),
                },
                onError: {
                    actions: [
                        xStateUtils.stateErrorTraceAction,
                        sendParent(({ context }): QueueManagerContextAnalysisRequestErrorEvent => ({
                            type: 'QUEUE_MANAGER_CONTEXT_ANALYSIS_REQUEST_ERROR',
                            word: context.word,
                            context: context.context,
                            error: new Error('Can\'t retrieve word context analysis'),
                        })),
                    ],
                },
            },
        },

        SAVING_EXPLANATION: {
            invoke: {
                src: 'explanationSaverActor',
                input: ({ context }) => ({
                    word: context.word,
                    context: context.context,
                    contextExplanation: context.contextExplanation,
                }),
                onDone: {
                    target: 'RETRIEVING_IMAGE',
                    actions: sendParent(({ event }): QueueManagerContextAnalysisExplanationRequestSuccessEvent => ({
                        type: 'QUEUE_MANAGER_CONTEXT_ANALYSIS_EXPLANATION_REQUEST_SUCCESS',
                        word: event.output,
                    })),
                },
                onError: {
                    actions: [
                        xStateUtils.stateErrorTraceAction,
                        sendParent(({ context }): QueueManagerContextAnalysisRequestErrorEvent => ({
                            type: 'QUEUE_MANAGER_CONTEXT_ANALYSIS_REQUEST_ERROR',
                            word: context.word,
                            context: context.context,
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
                    context: context.context,
                    style: context.style,
                }),
                onDone: {
                    target: 'SAVING_IMAGE',
                    actions: assign(({ event }) => ({ contextImage: event.output })),
                },
                onError: {
                    actions: [
                        xStateUtils.stateErrorTraceAction,
                        sendParent(({ context }): QueueManagerContextAnalysisRequestErrorEvent => ({
                            type: 'QUEUE_MANAGER_CONTEXT_ANALYSIS_REQUEST_ERROR',
                            word: context.word,
                            context: context.context,
                            error: new Error('Can\'t retrieve word context image'),
                        })),
                    ],
                },
            },
        },

        SAVING_IMAGE: {
            invoke: {
                src: 'imageSaverActor',
                input: ({ context }) => ({
                    word: context.word,
                    contextImage: context.contextImage,
                }),
                onDone: {
                    actions: sendParent(({ context, event }): QueueManagerContextAnalysisRequestSuccessEvent => ({
                        type: 'QUEUE_MANAGER_CONTEXT_ANALYSIS_REQUEST_SUCCESS',
                        word: event.output,
                        context: context.context,
                    })),
                },
                onError: {
                    actions: [
                        xStateUtils.stateErrorTraceAction,
                        sendParent(({ context }): QueueManagerContextAnalysisRequestErrorEvent => ({
                            type: 'QUEUE_MANAGER_CONTEXT_ANALYSIS_REQUEST_ERROR',
                            word: context.word,
                            context: context.context,
                            error: new Error('Can\'t update word context explanation in local DB'),
                        }))
                    ],
                },
            },
        }
    },
});
