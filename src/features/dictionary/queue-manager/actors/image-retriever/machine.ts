import { setup, sendParent } from 'xstate';
import { DatabaseController } from 'src/controllers';
import { xStateUtils } from 'src/utils';
import type { BookHighlight } from 'src/types';
import type { DictionaryWord } from '../../../types';
import type {
    QueueManagerImageRequestSuccessEvent,
    QueueManagerImageRequestErrorEvent,
} from '../../types';
import { imageActor } from './image-actor';

interface InputParameters {
    dbController: DatabaseController<DictionaryWord>,
    word: DictionaryWord,
    highlight: BookHighlight,
}

export const imageRetrieverMachine = setup({
    actors: {
        imageActor,
    },
    types: {
        context: {} as InputParameters,
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
                }),
                onDone: {
                    actions: sendParent(({ context, event }): QueueManagerImageRequestSuccessEvent => ({
                        type: 'QUEUE_MANAGER_IMAGE_REQUEST_SUCCESS',
                        highlight: context.highlight,
                        word: context.word,
                        image: event.output,
                    })),
                },
                onError: {
                    actions: [
                        sendParent(({ context, event }): QueueManagerImageRequestErrorEvent => ({
                            type: 'QUEUE_MANAGER_IMAGE_REQUEST_ERROR',
                            highlight: context.highlight,
                            word: context.word,
                            error: event.error,
                        })),
                        xStateUtils.stateErrorTraceAction,
                    ],
                },
            },
        },
    },
});
