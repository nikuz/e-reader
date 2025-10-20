import { useSelector } from '@xstate/react';
import { libraryStateMachineActor } from '../../state';
import type { LibraryStateContext } from '../../types';

export function useLibraryStateSelect<K extends keyof LibraryStateContext>(key: K): LibraryStateContext[K] {
    return useSelector(libraryStateMachineActor, (state) => state.context[key]);
}
