import type { BookFrameStateContext } from '../../types';

export function pageTurnPrevAction(props: {
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
    const prevPage = settings.page - 1;
    const prevScrollPosition = scrollStep * prevPage;
    
    // scroll within the chapter
    if (prevScrollPosition >= 0) {
        window.scrollTo({ left: prevScrollPosition });
        contextUpdate.settings = {
            ...settings,
            page: prevPage,
        };
        contextUpdate.scrollPosition = prevScrollPosition;
    }
    // change the chapter
    else {
        const prevChapter = Math.max(settings.chapter - 1, 0);
        const key = Object.keys(bookAttributes.spine)[prevChapter];

        contextUpdate.settings = {
            ...props.context.settings,
            chapter: prevChapter,
        };
        contextUpdate.chapterContent = bookAttributes.spine[key];
        contextUpdate.prevChapter = settings.chapter;
    }

    props.enqueue.assign(contextUpdate);
}