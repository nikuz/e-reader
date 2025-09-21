import type { BookFrameStateContext } from '../../types';

export function pageTurnPrevAction(props: {
    context: BookFrameStateContext,
    enqueue: { assign: (context: Partial<BookFrameStateContext>) => void },
}) {
    const book = props.context.book;
    const settings = props.context.settings;

    if (!book) {
        return;
    }

    const prevChapter = Math.max(settings.chapter - 1, 0);
    const key = Array.from(book.spine.keys())[prevChapter];
    const chapterUrl = book.spine.get(key) as string;

    props.enqueue.assign({
        settings: {
            ...props.context.settings,
            chapter: prevChapter,
            chapterUrl: `${book.dirname}/${chapterUrl}`,
        },
    });
}