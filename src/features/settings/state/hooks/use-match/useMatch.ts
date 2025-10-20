import { useSelector } from '@xstate/react';
import type { StateValueFrom } from 'xstate';
import { settingsStateMachine, settingsStateMachineActor } from '../../state';

export function useSettingsStateMatch(values: StateValueFrom<typeof settingsStateMachine>[]): boolean {
    return useSelector(settingsStateMachineActor, (state) =>
        values.some((value) => state.matches(value)),
    );
}
