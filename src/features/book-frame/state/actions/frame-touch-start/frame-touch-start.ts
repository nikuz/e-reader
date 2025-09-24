import type { BookFrameStateContext, FrameTouchStartEvent } from '../../types';

export function frameTouchStartAction(props: {
    event: FrameTouchStartEvent,
    context: BookFrameStateContext,
    enqueue: { assign: (context: Partial<BookFrameStateContext>) => void },
}) {
    props.enqueue.assign({
        frameInteractionStartTime: performance.now(),
        frameInteractionStartPosition: props.event.position,
    });
}