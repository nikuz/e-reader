import { createRoot, createMemo, type Accessor } from 'solid-js';
import type { StateValueFrom } from 'xstate';
import { fromActorRef } from '@xstate/solid';
import { bookLoaderStateMachine } from '../../../loader/state';
import { bookFrameStateMachineActor } from '../../state';

const snapshot = createRoot(() => fromActorRef(bookFrameStateMachineActor));
const loaderSnapshot = createRoot(() => fromActorRef(snapshot().context.loaderMachineRef));

export function useBookLoaderStateMatch(values: StateValueFrom<typeof bookLoaderStateMachine>[]): Accessor<boolean> {
    return createMemo(() => {
        for (const value of values) {
            if (loaderSnapshot()?.matches(value)) {
                return true;
            }
        }

        return false;
    });
}