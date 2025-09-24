import { setup, createActor, enqueueActions } from 'xstate';
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
    types: {
        context: {} as StatusBarStateContext,
        events: {} as StatusBarStateEvents,
    }
}).createMachine({
    id: 'STATUS_BAR',

    context: {
        visible: true,
    },

    initial: 'IDLE',

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
    },
});

export const statusBarStateMachineActor = createActor(statusBarStateMachine).start();