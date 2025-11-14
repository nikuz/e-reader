import { useSelector } from '@xstate/react';
import { screenOrientationStateMachineActor } from '../../state';
import type { ScreenOrientationStateContext } from '../../types';

export function useScreenOrientationStateSelect<K extends keyof ScreenOrientationStateContext>(key: K): ScreenOrientationStateContext[K] {
    return useSelector(screenOrientationStateMachineActor, (state) => state.context[key]);
}
