import { setup, createActor, assign } from 'xstate';
import { DatabaseController } from 'src/controllers';
import { DICTIONARY_DB_CONFIG } from '../constants';
import type { DictionaryWord } from '../types';
import { initializerActor } from './actors';
import type {
    DictionaryStateContext,
    DictionaryStateEvents,
} from './types';

export const dictionaryStateMachine = setup({
    actors: {
        initializerActor,
    },
    types: {
        context: {} as DictionaryStateContext,
        events: {} as DictionaryStateEvents,
    }
}).createMachine({
    id: 'DICTIONARY',

    context: {
        dbController: new DatabaseController<DictionaryWord>(DICTIONARY_DB_CONFIG),
        storedWords: [],
    },

    initial: 'INITIALIZING',

    states: {
        IDLE: {
            on: {
                
            },
        },

        INITIALIZING: {
            invoke: {
                src: 'initializerActor',
                input: ({ context }) => ({
                    dbController: context.dbController,
                }),
                onDone: {
                    target: 'IDLE',
                    actions: assign(({ event }) => ({
                        storedWords: event.output,
                    })),
                },
                onError: {
                    target: 'IDLE',
                    actions: assign(({ event }) => ({
                        errorMessage: event.error?.toString(),
                    })),
                },
            },
        },
    },
});

export const dictionaryStateMachineActor = createActor(dictionaryStateMachine).start();
