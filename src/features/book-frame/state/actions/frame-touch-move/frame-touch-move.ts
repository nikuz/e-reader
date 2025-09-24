import { PAGE_TURN_TOUCH_MIN_SHIFT } from '../../../constants';
import type { BookFrameStateContext, FrameTouchMoveEvent } from '../../types';

export function frameTouchMoveAction(props: {
    event: FrameTouchMoveEvent,
    context: BookFrameStateContext,
    enqueue: { assign: (context: Partial<BookFrameStateContext>) => void },
}) {
    const position = props.event.position;
    const frameInteractionStartPosition = props.context.frameInteractionStartPosition;

    if (
        !frameInteractionStartPosition
        || (
            Math.abs(frameInteractionStartPosition.x - position.x) < PAGE_TURN_TOUCH_MIN_SHIFT
            && Math.abs(frameInteractionStartPosition.y - position.y) < PAGE_TURN_TOUCH_MIN_SHIFT
        )
    ) {
        return;
    }

    props.enqueue.assign({
        frameInteractionStartTime: undefined,
        frameInteractionStartPosition: undefined,
    });
}