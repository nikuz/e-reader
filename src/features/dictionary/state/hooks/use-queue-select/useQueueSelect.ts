import { useSelector } from '@xstate/react';
import { dictionaryStateMachineActor } from '../../state';

export function useDictionaryStateQueueSelect(wordId: string): boolean {
    const queueActor = useSelector(dictionaryStateMachineActor, (state) => state.context.queueManagerRef);
    const requests = useSelector(queueActor, (state) => state?.context.requests);

    return requests?.[wordId] !== undefined;
}
