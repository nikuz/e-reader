import { setup, createActor, enqueueActions } from 'xstate';
import { xStateUtils } from 'src/utils';
import { initializerActor } from './actors';
import {
    hideAction,
    showAction,
    toggleAction,
} from './actions';
import type {
    StatusBarStateContext,
    StatusBarStateEvents,
} from './types';

export const statusBarStateMachine = setup({
    actors: { initializerActor },
    types: {
        context: {} as StatusBarStateContext,
        events: {} as StatusBarStateEvents,
    }
}).createMachine({
    id: 'STATUS_BAR',

    context: {
        visible: true,
    },

    initial: 'INITIALIZING',

    states: {
        IDLE: {
            on: {
                HIDE: {
                    actions: enqueueActions(hideAction),
                },
                SHOW: {
                    actions: enqueueActions(showAction),
                },
                TOGGLE: {
                    actions: enqueueActions(toggleAction),
                },
            },
        },

        INITIALIZING: {
            invoke: {
                src: 'initializerActor',
                onDone: 'IDLE',
                onError: {
                    target: 'IDLE',
                    actions: xStateUtils.stateErrorTraceAction,
                },
            }
        },
    },
});

export const statusBarStateMachineActor = createActor(statusBarStateMachine).start();