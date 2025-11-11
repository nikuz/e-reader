import { stopChild } from 'xstate';
import type {
    QueueManagerStateContext,
    QueueManagerWordAnalysisRequestSuccessEvent,
    QueueManagerWordAnalysisRequestErrorEvent,
    QueueManagerImageRequestSuccessEvent,
    QueueManagerImageRequestErrorEvent,
    QueueManagerPronunciationRequestSuccessEvent,
    QueueManagerPronunciationRequestErrorEvent,
    QueueManagerContextAnalysisRequestSuccessEvent,
    QueueManagerContextAnalysisRequestErrorEvent,
} from '../../types';

type InputEvent = 
    | QueueManagerWordAnalysisRequestSuccessEvent
    | QueueManagerWordAnalysisRequestErrorEvent
    | QueueManagerImageRequestSuccessEvent
    | QueueManagerImageRequestErrorEvent
    | QueueManagerPronunciationRequestSuccessEvent
    | QueueManagerPronunciationRequestErrorEvent
    | QueueManagerContextAnalysisRequestSuccessEvent
    | QueueManagerContextAnalysisRequestErrorEvent;

export function deleteRequestAction(props: {
    event: InputEvent,
    context: QueueManagerStateContext,
    enqueue: { assign: (context: Partial<QueueManagerStateContext>) => void },
}) {
    const requests = { ...props.context.requests };
    const word = props.event.word;
    let requestId = word.id.toString();

    switch (props.event.type) {
        case 'QUEUE_MANAGER_IMAGE_REQUEST_SUCCESS':
        case 'QUEUE_MANAGER_IMAGE_REQUEST_ERROR':
            requestId = `${requestId}-image`;
            break;
        
        case 'QUEUE_MANAGER_PRONUNCIATION_REQUEST_SUCCESS':
        case 'QUEUE_MANAGER_PRONUNCIATION_REQUEST_ERROR':
            requestId = `${requestId}-pronunciation`;
            break;
        
        case 'QUEUE_MANAGER_CONTEXT_ANALYSIS_REQUEST_SUCCESS':
        case 'QUEUE_MANAGER_CONTEXT_ANALYSIS_REQUEST_ERROR':
            requestId = `${requestId}-${props.event.context.id}`;
            break;
    }

    stopChild(requestId);
    delete requests[requestId];

    props.enqueue.assign({ requests });
}