import { PAGE_TURN_TOUCH_DELAY } from '../../../constants';
import type {
    BookFrameStateContext,
    BookFrameStateEvents,
    FrameTouchEndEvent,
} from '../../types';

export function frameTouchEndAction(props: {
    event: FrameTouchEndEvent,
    context: BookFrameStateContext,
    enqueue: {
        assign: (context: Partial<BookFrameStateContext>) => void,
        raise: (context: BookFrameStateEvents) => void,
    },
}) {
    const iframeEl = props.context.iframeEl;
    const frameInteractionStartTime = props.context.frameInteractionStartTime;
    const iframeDocument = iframeEl?.contentDocument;

    if (!iframeEl || !iframeDocument || frameInteractionStartTime === undefined) {
        return;
    }

    const position = props.event.position;

    if (performance.now() - frameInteractionStartTime < PAGE_TURN_TOUCH_DELAY) {
        const docRect = iframeDocument.documentElement.getBoundingClientRect();

        // left side touch
        if (position.x < docRect.width / 100 * 30) {
            props.enqueue.raise(({ type: 'PAGE_TURN_PREV' }));
        }
        // right side touch
        else if (position.x > docRect.width / 100 * 70) {
            props.enqueue.raise(({ type: 'PAGE_TURN_NEXT' }));
        }
    } else {
        props.enqueue.raise(({
            type: 'SELECT_TEXT',
            position,
        }));
    }

    props.enqueue.assign({
        frameInteractionStartTime: undefined,
    });
}