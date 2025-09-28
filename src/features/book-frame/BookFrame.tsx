import { onMount, onCleanup, Show } from 'solid-js';
import { useSearchParams, useNavigate } from '@solidjs/router';
import { Routes } from 'src/types';
import { FrameEventObserver } from './injections';
import {
    useBookFrameStateSelect,
    useBookLoaderStateMatch,
    bookFrameStateMachineActor,
} from './state';
import './style.css';

export default function BookFrame() {
    const [searchParams] = useSearchParams<{ bookSrc: string }>();
    const navigate = useNavigate();
    const chapterContent = useBookFrameStateSelect('chapterContent');
    const bookLoadErrorMessage = useBookFrameStateSelect('errorMessage');
    const bookIsLoading = useBookLoaderStateMatch(['LOADING_BOOK']);
    let eventObserver: FrameEventObserver;

    const frameContentLoadHandler = (event: Event) => {
        const iframeEl = event.target as HTMLIFrameElement;
        
        eventObserver = new FrameEventObserver(iframeEl);
        eventObserver.subscribe();

        bookFrameStateMachineActor.send({
            type: 'CHAPTER_LOAD',
            iframeEl,
        });
    };

    const navigateToLibraryHandler = () => {
        navigate(Routes.LIBRARY);
    };

    onMount(() => {
        if (searchParams.bookSrc) {
            bookFrameStateMachineActor.send({
                type: 'LOAD_BOOK',
                src: searchParams.bookSrc,
            });
        }
    });

    onCleanup(() => {
        eventObserver?.unsubscribe();
    });

    return (
        <div class="book-frame-container">
            {!searchParams.bookSrc && (
                <p class="flex flex-col">
                    Select book to display
                    <button
                        class="btn block rounded-lg mt-2"
                        onClick={navigateToLibraryHandler}
                    >
                        Go to Library
                    </button>
                </p>
            )}
            {bookIsLoading() && (
                <div class="book-loading">loading...</div>
            )}
            {bookLoadErrorMessage() && (
                <p class="book-error">{bookLoadErrorMessage()}</p>
            )}
            <Show when={chapterContent()}>
                <iframe
                    src={chapterContent()}
                    class="book-frame"
                    sandbox="allow-same-origin allow-scripts"
                    onLoad={frameContentLoadHandler}
                />
            </Show>
        </div>
    );
}