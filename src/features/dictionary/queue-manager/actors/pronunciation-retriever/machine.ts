import { setup, sendParent, assign } from 'xstate';
import { xStateUtils } from 'src/utils';
import type { BookHighlight } from 'src/types';
import {
    DICTIONARY_QUEUE_MANAGER_RETRY_TIMEOUT,
    DICTIONARY_QUEUE_MANAGER_RETRY_ATTEMPT,
} from '../../../constants';
import type { DictionaryWord } from '../../../types';
import type {
    QueueManagerPronunciationRequestSuccessEvent,
    QueueManagerPronunciationRequestErrorEvent,
} from '../../types';
import { pronunciationActor } from './pronunciation-actor';
import { dbSaverActor } from './db-saver-actor';

interface InputParameters {
    word: DictionaryWord,
    highlight: BookHighlight,
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
            pronunciationRetrieveAttempt: number,
        },
        input: {} as InputParameters,
    }
}).createMachine({
    id: 'DICTIONARY_QUEUE_MANAGER_PRONUNCIATION_RETRIEVER',

    context: ({ input }) => ({
        ...input,
        pronunciationRetrieveAttempt: 0,
    }),

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
                onError: [
                    {
                        guard: ({ context }) => context.pronunciationRetrieveAttempt < DICTIONARY_QUEUE_MANAGER_RETRY_ATTEMPT,
                        target: 'RETRYING',
                        actions: assign(({ context }) => ({ pronunciationRetrieveAttempt: context.pronunciationRetrieveAttempt + 1 })),
                    },
                    {
                        actions: [
                            sendParent(({ context, event }): QueueManagerPronunciationRequestErrorEvent => ({
                                type: 'QUEUE_MANAGER_PRONUNCIATION_REQUEST_ERROR',
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
                    pronunciation: context.pronunciation,
                }),
                onDone: {
                    actions: sendParent(({ context, event }): QueueManagerPronunciationRequestSuccessEvent => ({
                        type: 'QUEUE_MANAGER_PRONUNCIATION_REQUEST_SUCCESS',
                        word: event.output,
                        highlight: context.highlight,
                    })),
                },
                onError: {
                    actions: [
                        xStateUtils.stateErrorTraceAction,
                        sendParent(({ context }): QueueManagerPronunciationRequestErrorEvent => ({
                            type: 'QUEUE_MANAGER_PRONUNCIATION_REQUEST_ERROR',
                            word: context.word,
                            highlight: context.highlight,
                            error: new Error('Can\'t update word pronunciation in local DB'),
                        }))
                    ],
                },
            },
        }
    },
});
