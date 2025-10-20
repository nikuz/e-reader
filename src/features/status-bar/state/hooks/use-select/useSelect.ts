import { useSelector } from '@xstate/react';
import { statusBarStateMachineActor } from '../../state';
import type { StatusBarStateContext } from '../../types';

export function useStatusBarStateSelect<K extends keyof StatusBarStateContext>(key: K): StatusBarStateContext[K] {
    return useSelector(statusBarStateMachineActor, (state) => state.context[key]);
}
