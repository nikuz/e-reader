import { createRoot, createMemo, type Accessor } from 'solid-js';
import { fromActorRef } from '@xstate/solid';
import { statusBarStateMachineActor } from '../../state';
import type { StatusBarStateContext } from '../../types';

const snapshot = createRoot(() => fromActorRef(statusBarStateMachineActor));

export function useStatusBarStateSelect<K extends keyof StatusBarStateContext>(key: K): Accessor<StatusBarStateContext[K]> {
    return createMemo(() => snapshot().context[key]);
}