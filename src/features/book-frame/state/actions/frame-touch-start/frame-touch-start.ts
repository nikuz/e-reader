import type { BookFrameStateContext, FrameTouchStartEvent } from '../../types';

export function frameTouchStartAction(props: {
    event: FrameTouchStartEvent,
    context: BookFrameStateContext,
    enqueue: { assign: (context: Partial<BookFrameStateContext>) => void },
}) {
    props.enqueue.assign({
        frameTouchStartTime: Date.now(),
        frameInteractionStartPosition: props.event.position,
        textSelectionBaseRange: undefined,
        chapterHadBeenInteracted: true,
    });
}
