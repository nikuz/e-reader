import type { BookLoaderStateContext } from '../../types';

export function revokePrevBookUrlsAction(props: {
    context: BookLoaderStateContext,
    enqueue: { assign: (context: Partial<BookLoaderStateContext>) => void },
}) {
    const prevBook = props.context.book;
    if (!prevBook) {
        return;
    }

    for (const chapter of prevBook.spine) {
        if (chapter.url) {
            URL.revokeObjectURL(chapter.url);
        }
    }

    props.enqueue.assign({
        book: undefined,
    });
}