import type { BookFrameStateContext } from '../../types';

export function frameTouchCancelAction(props: {
    context: BookFrameStateContext,
    enqueue: { assign: (context: Partial<BookFrameStateContext>) => void },
}) {
    props.enqueue.assign({
        frameInteractionStartTime: undefined,
    });
}