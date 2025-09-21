import type { DoneActorEvent } from 'xstate';
import type { BookAttributes } from '../../../types';
import type { BookFrameStateContext } from '../../types';

export function initiateBookAction(props: {
    event: DoneActorEvent<BookAttributes>,
    context: BookFrameStateContext,
    enqueue: { assign: (context: Partial<BookFrameStateContext>) => void },
}) {
    const book = props.event.output;
    const key = Array.from(book.spine.keys())[0];
    const chapterUrl = book.spine.get(key) as string;

    props.enqueue.assign({
        book,
        settings: {
            ...props.context.settings,
            chapterUrl: `${book.dirname}/${chapterUrl}`,
        },
    });
}