import { useSelector } from '@xstate/react';
import { screenStateMachineActor } from '../../state';
import type { ScreenStateContext } from '../../types';

export function useOrientationStateSelect<K extends keyof ScreenStateContext>(key: K): ScreenStateContext[K] {
    return useSelector(screenStateMachineActor, (state) => state.context[key]);
}
