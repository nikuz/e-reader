import { setup, createActor, assign, sendTo } from 'xstate';
import { DatabaseController } from 'src/controllers';
import { xStateUtils } from 'src/utils';
import { queueManagerStateMachine } from '../queue-manager';
import { DICTIONARY_DB_CONFIG } from '../constants';
import type { DictionaryWord } from '../types';
import {
    initializerActor,
} from './actors';
import type {
    DictionaryStateContext,
    DictionaryStateEvents,
} from './types';

export const dictionaryStateMachine = setup({
    actors: {
        queueManagerStateMachine,
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

    entry: assign(({ context, spawn }) => ({
        queueManagerRef: spawn('queueManagerStateMachine', {
            id: 'queue-manager',
            input: {
                dbController: context.dbController,
            },
        }),
    })),

    initial: 'INITIALIZING',

    states: {
        IDLE: {
            on: {
                REQUEST_WORD_ANALYSIS: {
                    actions: sendTo('queue-manager', ({ event }) => event),
                },
                REQUEST_IMAGE: {
                    actions: sendTo('queue-manager', ({ event }) => event),
                },
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
                    actions: [
                        assign(({ event }) => ({
                            errorMessage: event.error?.toString(),
                        })),
                        xStateUtils.stateErrorTraceAction,
                    ],
                },
            },
        },
    },
});

export const dictionaryStateMachineActor = createActor(dictionaryStateMachine).start();
