import { setup, sendParent, assign } from 'xstate';
import { DatabaseController } from 'src/controllers';
import { xStateUtils } from 'src/utils';
import type { DictionaryWord } from '../../../types';
import type {
    QueueManagerPronunciationRequestSuccessEvent,
    QueueManagerPronunciationRequestErrorEvent,
} from '../../types';
import { pronunciationActor } from './pronunciation-actor';
import { dbSaverActor } from './db-saver-actor';

interface InputParameters {
    dbController: DatabaseController,
    word: DictionaryWord,
    style?: string,
}

export const pronunciationRetrieverMachine = setup({
    actors: {
        pronunciationActor,
        dbSaverActor,
    },
    types: {
        context: {} as InputParameters & {
            pronunciation?: string,
        },
        input: {} as InputParameters,
    }
}).createMachine({
    id: 'DICTIONARY_QUEUE_MANAGER_PRONUNCIATION_RETRIEVER',

    context: ({ input }) => input,

    initial: 'RETRIEVING',

    states: {
        RETRIEVING: {
            invoke: {
                src: 'pronunciationActor',
                input: ({ context }) => ({ word: context.word }),
                onDone: {
                    target: 'SAVING_TO_DB',
                    actions: assign(({ event }) => ({ pronunciation: event.output })),
                },
                onError: {
                    actions: [
                        sendParent(({ context, event }): QueueManagerPronunciationRequestErrorEvent => ({
                            type: 'QUEUE_MANAGER_PRONUNCIATION_REQUEST_ERROR',
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
                    pronunciation: context.pronunciation,
                }),
                onDone: {
                    actions: sendParent(({ event }): QueueManagerPronunciationRequestSuccessEvent => ({
                        type: 'QUEUE_MANAGER_PRONUNCIATION_REQUEST_SUCCESS',
                        word: event.output,
                    })),
                },
                onError: {
                    actions: [
                        xStateUtils.stateErrorTraceAction,
                        sendParent(({ context }): QueueManagerPronunciationRequestErrorEvent => ({
                            type: 'QUEUE_MANAGER_PRONUNCIATION_REQUEST_ERROR',
                            word: context.word,
                            error: new Error('Can\'t update word pronunciation in local DB'),
                        }))
                    ],
                },
            },
        }
    },
});
