import { createRoot, createMemo, type Accessor } from 'solid-js';
import { fromActorRef } from '@xstate/solid';
import { bookFrameStateMachineActor } from '../../state';
import type { BookFrameStateContext } from '../../types';

const snapshot = createRoot(() => fromActorRef(bookFrameStateMachineActor));

export function useBookFrameStateSelect<K extends keyof BookFrameStateContext>(key: K): Accessor<BookFrameStateContext[K]> {
    return createMemo(() => snapshot().context[key]);
}