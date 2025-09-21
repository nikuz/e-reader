import { createEffect, onCleanup, Show } from 'solid-js';
import { injectStyle, FrameEventObserver } from './injections';
import {
    useBookFrameStateSelect,
    useBookFrameStateMatch,
    bookFrameStateMachineActor,
} from './state';
import './style.css';

interface Props {
    src: string,
 }

export default function BookFrame(props: Props) {
    const bookSettings = useBookFrameStateSelect('settings');
    const bookLoadErrorMessage = useBookFrameStateSelect('errorMessage');
    const bookIsLoading = useBookFrameStateMatch(['LOADING_BOOK']);
    let eventObserver: FrameEventObserver;
    
    const frameContentLoadHandler = (event: Event) => {
        const iframeEl = event.target as HTMLIFrameElement;
        injectStyle(iframeEl);
        
        eventObserver = new FrameEventObserver(iframeEl);
        eventObserver.subscribe();

        bookFrameStateMachineActor.send({
            type: 'CHAPTER_LOAD',
            iframeEl,
        });
    };

    createEffect(() => {
        if (props.src) {
            bookFrameStateMachineActor.send({
                type: 'LOAD_BOOK',
                src: props.src,
            });
        }
    });

    onCleanup(() => {
        eventObserver?.unsubscribe();
    });

    return (
        <div class="book-frame-container">
            {bookIsLoading() && (
                <div class="book-loading">loading...</div>
            )}
            {bookLoadErrorMessage() && (
                <p class="book-error">{bookLoadErrorMessage()}</p>
            )}
            <Show when={bookSettings().chapterUrl !== ''}>
                <iframe
                    src={bookSettings().chapterUrl}
                    class="book-frame"
                    sandbox="allow-same-origin allow-scripts"
                    onLoad={frameContentLoadHandler}
                />
            </Show>
        </div>
    );
}