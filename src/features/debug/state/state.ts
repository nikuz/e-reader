import { setup, createActor } from 'xstate';
import type {
    DebugStateContext,
    DebugStateEvents,
} from './types';

export const debugStateMachine = setup({
    types: {
        context: {} as DebugStateContext,
        events: {} as DebugStateEvents,
    }
}).createMachine({
    id: 'DEBUG',

    context: {
        enabled: localStorage.getItem('debug') === 'true',
    },

    initial: 'HIDDEN',

    states: {
        HIDDEN: {
            on: {
                SHOW: 'VISIBLE',
            },
        },

        VISIBLE: {
            on: {
                HIDE: 'HIDDEN',
            },
        },
    },
});

export const debugStateMachineActor = createActor(debugStateMachine).start();
