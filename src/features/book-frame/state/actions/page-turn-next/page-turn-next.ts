import type { BookFrameStateContext } from '../../types';

export function pageTurnNextAction(props: {
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
    const nextPage = settings.page + 1;
    const nextScrollPosition = window.innerWidth * nextPage;

    // scroll within the chapter
    if (nextScrollPosition < bodyEl.scrollWidth) {
        window.scrollTo({ left: nextScrollPosition });
        contextUpdate.settings = {
            ...settings,
            page: nextPage,
        };
    }
    // change the chapter
    else {
        const chapters = Array.from(book.spine.keys());
        const nextChapter = Math.min(settings.chapter + 1, chapters.length - 1);
        const key = chapters[nextChapter];

        contextUpdate.settings = {
            page: 0,
            chapter: nextChapter,
        };
        contextUpdate.chapterContent = book.spine.get(key);
        contextUpdate.prevChapter = settings.chapter;
    }

    props.enqueue.assign(contextUpdate);
}