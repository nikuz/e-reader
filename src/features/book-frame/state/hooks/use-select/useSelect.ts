import { useSelector } from '@xstate/react';
import { bookFrameStateMachineActor } from '../../state';
import type { BookFrameStateContext } from '../../types';

export function useBookFrameStateSelect<K extends keyof BookFrameStateContext>(key: K): BookFrameStateContext[K] {
    return useSelector(bookFrameStateMachineActor, (state) => state.context[key]);
}
