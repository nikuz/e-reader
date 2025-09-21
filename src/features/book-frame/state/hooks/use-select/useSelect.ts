import { createRoot, createMemo, type Accessor } from 'solid-js';
import { fromActorRef } from '@xstate/solid';
import { bookFrameStateMachineActor } from '../../state';
import type { bookFrameStateContext } from '../../types';

const snapshot = createRoot(() => fromActorRef(bookFrameStateMachineActor));

export function useBookFrameStateSelect<K extends keyof bookFrameStateContext>(key: K): Accessor<bookFrameStateContext[K]> {
    return createMemo(() => snapshot().context[key]);
}