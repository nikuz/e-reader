import type { BookFrameStateContext } from '../../types';

export function pageTurnNextAction(props: {
    context: BookFrameStateContext,
    enqueue: { assign: (context: Partial<BookFrameStateContext>) => void },
}) {
    const book = props.context.book;
    const settings = props.context.settings;

    if (!book) {
        return;
    }

    const chapters = Array.from(book.spine.keys());
    const nextChapter = Math.min(settings.chapter + 1, chapters.length - 1);
    const key = chapters[nextChapter];
    const chapterUrl = book.spine.get(key) as string;

    props.enqueue.assign({
        settings: {
            ...props.context.settings,
            chapter: nextChapter,
            chapterUrl: `${book.dirname}/${chapterUrl}`,
        },
    });
}