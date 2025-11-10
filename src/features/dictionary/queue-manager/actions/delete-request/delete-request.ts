import { stopChild } from 'xstate';
import type {
    QueueManagerStateContext,
    QueueManagerWordAnalysisRequestSuccessEvent,
    QueueManagerWordAnalysisRequestErrorEvent,
    QueueManagerImageRequestSuccessEvent,
    QueueManagerImageRequestErrorEvent,
} from '../../types';

type InputEvent = 
    | QueueManagerWordAnalysisRequestSuccessEvent
    | QueueManagerWordAnalysisRequestErrorEvent
    | QueueManagerImageRequestSuccessEvent
    | QueueManagerImageRequestErrorEvent;

export function deleteRequestAction(props: {
    event: InputEvent,
    context: QueueManagerStateContext,
    enqueue: { assign: (context: Partial<QueueManagerStateContext>) => void },
}) {
    const requests = { ...props.context.requests };
    const word = props.event.word;

    stopChild(word.id.toString());
    delete requests[word.id];

    props.enqueue.assign({ requests });
}