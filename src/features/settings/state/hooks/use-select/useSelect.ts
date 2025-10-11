import { createRoot, createMemo, type Accessor } from 'solid-js';
import { fromActorRef } from '@xstate/solid';
import { settingsStateMachineActor } from '../../state';
import type { SettingsStateContext } from '../../types';

const snapshot = createRoot(() => fromActorRef(settingsStateMachineActor));

export function useSettingsStateSelect<K extends keyof SettingsStateContext>(key: K): Accessor<SettingsStateContext[K]> {
    return createMemo(() => snapshot().context[key]);
}