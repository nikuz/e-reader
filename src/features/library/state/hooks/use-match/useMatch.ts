import { createRoot, createMemo, type Accessor } from 'solid-js';
import type { StateValueFrom } from 'xstate';
import { fromActorRef } from '@xstate/solid';
import { libraryStateMachine, libraryStateMachineActor } from '../../state';

const snapshot = createRoot(() => fromActorRef(libraryStateMachineActor));

export function useLibraryStateMatch(values: StateValueFrom<typeof libraryStateMachine>[]): Accessor<boolean> {
    return createMemo(() => {
        for (const value of values) {
            if (snapshot().matches(value)) {
                return true;
            }
        }

        return false;
    });
}