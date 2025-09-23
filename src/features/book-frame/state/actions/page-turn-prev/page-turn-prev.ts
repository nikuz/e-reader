import type { BookFrameStateContext } from '../../types';

export function pageTurnPrevAction(props: {
    context: BookFrameStateContext,
    enqueue: { assign: (context: Partial<BookFrameStateContext>) => void },
}) {
    const iframeEl = props.context.iframeEl;
    const window = iframeEl?.contentWindow;
    const bodyEl = iframeEl?.contentDocument?.body;
    const book = props.context.book;

    if (!window || !bodyEl || !book) {
        return;
    }

    const contextUpdate: Partial<BookFrameStateContext> = {};
    const settings = props.context.settings;
    const prevPage = settings.page - 1;
    const prevScrollPosition = window.innerWidth * prevPage;
    
    // scroll within the chapter
    if (prevScrollPosition >= 0) {
        window.scrollTo({ left: prevScrollPosition });
        contextUpdate.settings = {
            ...settings,
            page: prevPage,
        };
    }
    // change the chapter
    else {
        const prevChapter = Math.max(settings.chapter - 1, 0);
        const key = Array.from(book.spine.keys())[prevChapter];
        const chapterUrl = book.spine.get(key) as string;

        contextUpdate.settings = {
            ...props.context.settings,
            chapter: prevChapter,
            chapterUrl: `${book.dirname}/${chapterUrl}`,
        };
        contextUpdate.prevChapter = settings.chapter;
    }

    props.enqueue.assign(contextUpdate);
}