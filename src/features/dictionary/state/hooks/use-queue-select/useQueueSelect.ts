import { useSelector } from '@xstate/react';
import { dictionaryStateMachineActor } from '../../state';

export function useDictionaryStateQueueSelect(wordId: number | string | undefined): boolean {
    const queueActor = useSelector(dictionaryStateMachineActor, (state) => state.context.queueManagerRef);
    const requests = useSelector(queueActor, (state) => state?.context.requests);

    if (wordId === undefined) {
        return false;
    }

    return requests?.[wordId] !== undefined;
}
