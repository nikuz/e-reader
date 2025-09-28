import { createRoot, createMemo, type Accessor } from 'solid-js';
import { fromActorRef } from '@xstate/solid';
import { libraryStateMachineActor } from '../../state';
import type { LibraryStateContext } from '../../types';

const snapshot = createRoot(() => fromActorRef(libraryStateMachineActor));

export function useLibraryStateSelect<K extends keyof LibraryStateContext>(key: K): Accessor<LibraryStateContext[K]> {
    return createMemo(() => snapshot().context[key]);
}