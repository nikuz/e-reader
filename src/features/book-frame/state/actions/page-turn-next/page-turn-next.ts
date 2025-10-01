import type { BookFrameStateContext } from '../../types';

export function pageTurnNextAction(props: {
    context: BookFrameStateContext,
    enqueue: { assign: (context: Partial<BookFrameStateContext>) => void },
}) {
    const iframeEl = props.context.iframeEl;
    const window = iframeEl?.contentWindow;
    const bookAttributes = props.context.bookAttributes;
    
    if (!window || !bookAttributes) {
        return;
    }
    
    const contextUpdate: Partial<BookFrameStateContext> = {};
    const settings = props.context.settings;
    const screenRect = props.context.screenRect;
    const chapterRect = props.context.chapterRect;
    const pagesAmount = Math.round(chapterRect.width / screenRect.width);
    const scrollStep = Math.ceil(chapterRect.width / pagesAmount);
    const nextPage = settings.page + 1;
    const nextScrollPosition = scrollStep * nextPage;

    // scroll within the chapter
    if (nextScrollPosition < chapterRect.width) {
        window.scrollTo({ left: nextScrollPosition });
        contextUpdate.settings = {
            ...settings,
            page: nextPage,
        };
        contextUpdate.scrollPosition = nextScrollPosition;
    }
    // change the chapter
    else {
        const chapters = Object.keys(bookAttributes.spine);
        const nextChapter = Math.min(settings.chapter + 1, chapters.length - 1);
        const key = chapters[nextChapter];

        contextUpdate.settings = {
            page: 0,
            chapter: nextChapter,
        };
        contextUpdate.chapterContent = bookAttributes.spine[key];
        contextUpdate.prevChapter = settings.chapter;
        contextUpdate.scrollPosition = 0;
    }

    props.enqueue.assign(contextUpdate);
}