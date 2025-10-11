import { createRoot, createMemo, type Accessor } from 'solid-js';
import type { StateValueFrom } from 'xstate';
import { fromActorRef } from '@xstate/solid';
import { settingsStateMachine, settingsStateMachineActor } from '../../state';

const snapshot = createRoot(() => fromActorRef(settingsStateMachineActor));

export function useSettingsStateMatch(values: StateValueFrom<typeof settingsStateMachine>[]): Accessor<boolean> {
    return createMemo(() => {
        for (const value of values) {
            if (snapshot().matches(value)) {
                return true;
            }
        }

        return false;
    });
}