import { setup, sendParent, assign } from 'xstate';
import { DatabaseController } from 'src/controllers';
import { xStateUtils } from 'src/utils';
import type { DictionaryWord } from '../../../types';
import type {
    QueueManagerImageRequestSuccessEvent,
    QueueManagerImageRequestErrorEvent,
} from '../../types';
import { imageActor } from './image-actor';
import { dbSaverActor } from './db-saver-actor';

interface InputParameters {
    dbController: DatabaseController,
    word: DictionaryWord,
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
        },
        input: {} as InputParameters,
    }
}).createMachine({
    id: 'DICTIONARY_QUEUE_MANAGER_IMAGE_RETRIEVER',

    context: ({ input }) => input,

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
                onError: {
                    actions: [
                        sendParent(({ context, event }): QueueManagerImageRequestErrorEvent => ({
                            type: 'QUEUE_MANAGER_IMAGE_REQUEST_ERROR',
                            word: context.word,
                            error: event.error,
                        })),
                        xStateUtils.stateErrorTraceAction,
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
                    image: context.image,
                }),
                onDone: {
                    actions: sendParent(({ event }): QueueManagerImageRequestSuccessEvent => ({
                        type: 'QUEUE_MANAGER_IMAGE_REQUEST_SUCCESS',
                        word: event.output,
                    })),
                },
                onError: {
                    actions: [
                        xStateUtils.stateErrorTraceAction,
                        sendParent(({ context }): QueueManagerImageRequestErrorEvent => ({
                            type: 'QUEUE_MANAGER_IMAGE_REQUEST_ERROR',
                            word: context.word,
                            error: new Error('Can\'t update word image in local DB'),
                        }))
                    ],
                },
            },
        }
    },
});
