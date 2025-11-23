import { setup, sendParent, assign } from 'xstate';
import { xStateUtils } from 'src/utils';
import type { BookHighlight } from 'src/types';
import {
    DICTIONARY_QUEUE_MANAGER_RETRY_TIMEOUT,
    DICTIONARY_QUEUE_MANAGER_RETRY_ATTEMPT,
} from '../../../constants';
import type { DictionaryWord } from '../../../types';
import type {
    QueueManagerImageRequestSuccessEvent,
    QueueManagerImageRequestErrorEvent,
} from '../../types';
import { imageActor } from './image-actor';
import { dbSaverActor } from './db-saver-actor';

interface InputParameters {
    word: DictionaryWord,
    highlight: BookHighlight,
    style?: string,
}

export const imageRetrieverMachine = setup({
    actors: {
        imageActor,
        dbSaverActor,
    },
    types: {
        context: {} as InputParameters & {
            image?: string,
            imageRetrieveAttempt: number,
        },
        input: {} as InputParameters,
    }
}).createMachine({
    id: 'DICTIONARY_QUEUE_MANAGER_IMAGE_RETRIEVER',

    context: ({ input }) => ({
        ...input,
        imageRetrieveAttempt: 0,
    }),

    initial: 'RETRIEVING',

    states: {
        RETRIEVING: {
            invoke: {
                src: 'imageActor',
                input: ({ context }) => ({
                    word: context.word,
                    style: context.style,
                }),
                onDone: {
                    target: 'SAVING_TO_DB',
                    actions: assign(({ event }) => ({ image: event.output })),
                },
                onError: [
                    {
                        guard: ({ context }) => context.imageRetrieveAttempt < DICTIONARY_QUEUE_MANAGER_RETRY_ATTEMPT,
                        target: 'RETRYING',
                        actions: assign(({ context }) => ({ imageRetrieveAttempt: context.imageRetrieveAttempt + 1 })),
                    },
                    {
                        actions: [
                            sendParent(({ context, event }): QueueManagerImageRequestErrorEvent => ({
                                type: 'QUEUE_MANAGER_IMAGE_REQUEST_ERROR',
                                word: context.word,
                                highlight: context.highlight,
                                error: event.error,
                            })),
                            xStateUtils.stateErrorTraceAction,
                        ],
                    }
                ],
            },
        },

        RETRYING: {
            after: {
                [DICTIONARY_QUEUE_MANAGER_RETRY_TIMEOUT]: 'RETRIEVING',
            },
        },

        SAVING_TO_DB: {
            invoke: {
                src: 'dbSaverActor',
                input: ({ context }) => ({
                    word: context.word,
                    image: context.image,
                }),
                onDone: {
                    actions: sendParent(({ context, event }): QueueManagerImageRequestSuccessEvent => ({
                        type: 'QUEUE_MANAGER_IMAGE_REQUEST_SUCCESS',
                        word: event.output,
                        highlight: context.highlight,
                    })),
                },
                onError: {
                    actions: [
                        xStateUtils.stateErrorTraceAction,
                        sendParent(({ context }): QueueManagerImageRequestErrorEvent => ({
                            type: 'QUEUE_MANAGER_IMAGE_REQUEST_ERROR',
                            word: context.word,
                            highlight: context.highlight,
                            error: new Error('Can\'t update word image in local DB'),
                        }))
                    ],
                },
            },
        }
    },
});
