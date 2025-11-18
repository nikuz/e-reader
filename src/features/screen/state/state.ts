import { setup, createActor, assign } from 'xstate';
import { xStateUtils } from 'src/utils';
import {
    portraitLockerActor,
    landscapeLockerActor,
    unlockerActor,
} from './actors';
import type {
    ScreenStateContext,
    ScreenStateEvents,
} from './types';

export const screenStateMachine = setup({
    actors: { 
        portraitLockerActor,
        landscapeLockerActor,
        unlockerActor,
    },
    types: {
        context: {} as ScreenStateContext,
        events: {} as ScreenStateEvents,
    }
}).createMachine({
    id: 'SCREEN_ORIENTATION',

    context: {
        orientation: 'any',
    },

    initial: 'LOCKING_PORTRAIT',

    states: {
        IDLE: {
            on: {
                LOCK_PORTRAIT: 'LOCKING_PORTRAIT',
                LOCK_LANDSCAPE: 'LOCKING_LANDSCAPE',
                UNLOCK: 'UNLOCKING',
                SET_CURRENT_ORIENTATION: {
                    actions: assign(({ event }) => ({
                        orientation: event.orientation,
                    })),
                }
            },
        },

        LOCKING_PORTRAIT: {
            invoke: {
                src: 'portraitLockerActor',
                onDone: 'IDLE',
                onError: {
                    target: 'IDLE',
                    actions: xStateUtils.stateErrorTraceAction,
                },
            }
        },
        
        LOCKING_LANDSCAPE: {
            invoke: {
                src: 'landscapeLockerActor',
                onDone: 'IDLE',
                onError: {
                    target: 'IDLE',
                    actions: xStateUtils.stateErrorTraceAction,
                },
            }
        },
        
        UNLOCKING: {
            invoke: {
                src: 'unlockerActor',
                onDone: 'IDLE',
                onError: {
                    target: 'IDLE',
                    actions: xStateUtils.stateErrorTraceAction,
                },
            }
        },
    },
});

export const screenStateMachineActor = createActor(screenStateMachine).start();