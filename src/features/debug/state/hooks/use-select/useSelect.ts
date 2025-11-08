import { useSelector } from '@xstate/react';
import { debugStateMachineActor } from '../../state';
import type { DebugStateContext } from '../../types';

export function useDebugStateSelect<K extends keyof DebugStateContext>(key: K): DebugStateContext[K] {
    return useSelector(debugStateMachineActor, (state) => state.context[key]);
}
