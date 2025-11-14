import { setup, createActor, assign } from 'xstate';
import { xStateUtils } from 'src/utils';
import {
    portraitLockerActor,
    landscapeLockerActor,
    unlockerActor,
} from './actors';
import type {
    ScreenOrientationStateContext,
    ScreenOrientationStateEvents,
} from './types';

export const screenOrientationStateMachine = setup({
    actors: { 
        portraitLockerActor,
        landscapeLockerActor,
        unlockerActor,
    },
    types: {
        context: {} as ScreenOrientationStateContext,
        events: {} as ScreenOrientationStateEvents,
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

export const screenOrientationStateMachineActor = createActor(screenOrientationStateMachine).start();