import { onCleanup, Show } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { Toast, Spinner } from 'src/components';
import { Routes } from 'src/types';
import { FrameEventObserver } from './injections';
import {
    useBookFrameStateSelect,
    useBookLoaderStateMatch,
    bookFrameStateMachineActor,
} from './state';
import './style.css';

export default function BookFrame() {
    const navigate = useNavigate();
    const book = useBookFrameStateSelect('bookAttributes');
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

    const closeErrorHandler = () => {
        bookFrameStateMachineActor.send({ type: 'CLOSE_BOOK_LOAD_ERROR' });
    };

    onCleanup(() => {
        eventObserver?.unsubscribe();
    });

    return (
        <div class="book-frame-container">
            {!book() && !bookLoadErrorMessage() && (
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
                <Spinner size="xl" color="accent" blocker />
            )}
            <Show when={bookLoadErrorMessage()}>
                <Toast
                    message={
                        <span>
                            Book rendering error
                            <br />
                            {bookLoadErrorMessage()}
                        </span>
                    }
                    type="error"
                    class="mt-10"
                    onClose={closeErrorHandler}
                />
            </Show>
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