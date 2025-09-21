import type { BookFrameStateContext, ChapterLoadEvent } from '../../types';

export function chapterLoadAction(props: {
    event: ChapterLoadEvent,
    context: BookFrameStateContext,
    enqueue: { assign: (context: Partial<BookFrameStateContext>) => void },
}) {
    props.enqueue.assign({
        iframeEl: props.event.iframeEl,
    });
}