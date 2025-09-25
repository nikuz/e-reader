import type { BookFrameStateContext, FrameTouchMoveEvent } from '../../types';

export function frameTouchMoveAction(props: {
    event: FrameTouchMoveEvent,
    context: BookFrameStateContext,
    enqueue: { assign: (context: Partial<BookFrameStateContext>) => void },
}) {
    props.enqueue.assign({
        frameInteractionStartTime: undefined,
        frameInteractionStartPosition: undefined,
    });
}