import { useSelector } from '@xstate/react';
import { settingsStateMachineActor } from '../../state';
import type { SettingsStateContext } from '../../types';

export function useSettingsStateSelect<K extends keyof SettingsStateContext>(key: K): SettingsStateContext[K] {
    return useSelector(settingsStateMachineActor, (state) => state.context[key]);
}
