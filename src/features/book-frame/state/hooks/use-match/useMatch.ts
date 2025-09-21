import { createRoot, createMemo, type Accessor } from 'solid-js';
import type { StateValueFrom } from 'xstate';
import { fromActorRef } from '@xstate/solid';
import { bookFrameStateMachine, bookFrameStateMachineActor } from '../../state';

const snapshot = createRoot(() => fromActorRef(bookFrameStateMachineActor));

export function useBookFrameStateMatch(values: StateValueFrom<typeof bookFrameStateMachine>[]): Accessor<boolean> {
    return createMemo(() => {
        for (const value of values) {
            if (snapshot().matches(value)) {
                return true;
            }
        }

        return false;
    });
}