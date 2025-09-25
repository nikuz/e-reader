import type { BookFrameStateContext, FrameTouchStartEvent } from '../../types';

export function frameTouchStartAction(props: {
    event: FrameTouchStartEvent,
    context: BookFrameStateContext,
    enqueue: { assign: (context: Partial<BookFrameStateContext>) => void },
}) {
    const textSelection = props.context.textSelection;

    if (textSelection?.toString().length) {
        textSelection?.removeAllRanges();

        props.enqueue.assign({
            textSelection: undefined,
        });

        return;
    }

    props.enqueue.assign({
        frameInteractionStartTime: performance.now(),
        frameInteractionStartPosition: props.event.position,
    });
}