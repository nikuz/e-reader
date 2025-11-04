import { setup, enqueueActions } from 'xstate';
import { DatabaseController } from 'src/controllers';
import type { DictionaryWord } from '../types';
import { translationRetrieverMachine, imageRetrieverMachine } from './actors';
import type {
    QueueManagerStateContext,
    QueueManagerStateEvents,
} from './types';

interface InputParameters {
    dbController: DatabaseController<DictionaryWord>,
}

export const queueManagerStateMachine = setup({
    actors: {
        translationRetrieverMachine,
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
                REQUEST_TRANSLATION: {
                    actions: enqueueActions(({ event, context, enqueue }) => {
                        enqueue.spawnChild('translationRetrieverMachine', {
                            input: {
                                dbController: context.dbController,
                                highlight: event.highlight,
                            },
                        });
                    }),
                },

                QUEUE_MANAGER_TRANSLATION_REQUEST_SUCCESS: {
                    actions: [],
                },
                
                QUEUE_MANAGER_TRANSLATION_REQUEST_ERROR: {
                    actions: [],
                },

                REQUEST_IMAGE: {
                    actions: enqueueActions(({ event, context, enqueue }) => {
                        enqueue.spawnChild('imageRetrieverMachine', {
                            input: {
                                dbController: context.dbController,
                                word: event.word,
                                highlight: event.highlight,
                            },
                        });
                    }),
                },
            }
        },
    },
});
