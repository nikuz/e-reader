import { setup } from 'xstate';
import { DatabaseController } from 'src/controllers';
import { xStateUtils } from 'src/utils';
import type { BookHighlight } from 'src/types';
import type { DictionaryWord } from '../../../types';
import { translationActor } from './translation-actor';

interface InputParameters {
    dbController: DatabaseController<DictionaryWord>,
    highlight: BookHighlight,
}

export const translationRetrieverMachine = setup({
    actors: {
        translationActor,
    },
    types: {
        context: {} as InputParameters,
        input: {} as InputParameters,
    }
}).createMachine({
    id: 'DICTIONARY_QUEUE_MANAGER_TRANSLATION_RETRIEVER',

    context: ({ input }) => input,

    initial: 'RETRIEVING',

    states: {
        RETRIEVING: {
            type: 'parallel',

            states: {
                TRANSLATING: {
                    initial: 'LOADING',
                    states: {
                        LOADING: {
                            invoke: {
                                src: 'translationActor',
                                input: ({ context }) => ({
                                    highlight: context.highlight,
                                }),
                                onDone: {
                                    target: 'SUCCESS',
                                },
                                onError: {
                                    target: 'ERROR',
                                    actions: [
                                        // assign(({ event }) => ({
                                        //     errorMessage: event.error?.toString(),
                                        // })),
                                        xStateUtils.stateErrorTraceAction,
                                    ],
                                },
                            },
                        },
                        SUCCESS: { type: 'final' },
                        ERROR: { type: 'final' }
                    }
                }
            },

            onDone: {

            },
        },
    },
});
