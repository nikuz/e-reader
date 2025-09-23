import type { DoneActorEvent } from 'xstate';
import type { BookAttributes } from '../../../types';
import type { BookFrameStateContext } from '../../types';

export function initiateBookAction(props: {
    event: DoneActorEvent<BookAttributes>,
    context: BookFrameStateContext,
    enqueue: { assign: (context: Partial<BookFrameStateContext>) => void },
}) {
    const book = props.event.output;
    const initialChapter = 0;
    const key = Array.from(book.spine.keys())[initialChapter];

    props.enqueue.assign({
        book,
        settings: {
            ...props.context.settings,
            chapter: initialChapter,
        },
        chapterContent: book.spine.get(key),
    });
}