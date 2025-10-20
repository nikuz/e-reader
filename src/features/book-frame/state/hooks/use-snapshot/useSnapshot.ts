import { useCallback } from 'react';
import { bookFrameStateMachineActor } from '../../state';
import type { BookFrameStateContext } from '../../types';

export function useBookFrameStateSnapshot<K extends keyof BookFrameStateContext>(key: K): () => BookFrameStateContext[K] {
    return useCallback(() => {
        const snapshot = bookFrameStateMachineActor.getSnapshot();
        return snapshot.context[key];
    }, [key]);
}
