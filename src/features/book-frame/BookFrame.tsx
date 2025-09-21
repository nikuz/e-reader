import { createMemo, createEffect, onCleanup, Show } from 'solid-js';
import { injectStyle, EventObserver } from './injections';
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
    const bookAttributes = useBookFrameStateSelect('book');
    const bookLoadErrorMessage = useBookFrameStateSelect('errorMessage');
    const bookIsLoading = useBookFrameStateMatch(['LOADING_BOOK']);
    let eventObserver: EventObserver;
    
    const firstPage = createMemo<string>(() => {
        const spine = bookAttributes()?.spine;
        if (spine) {
            const key = Array.from(spine.keys())[0];
            return spine.get(key) as string;
        }
        return '';
    });

    const frameContentLoadHandler = (event: Event) => {
        const iframe = event.target as HTMLIFrameElement;
        injectStyle(iframe);

        eventObserver = new EventObserver(iframe);
        eventObserver.subscribe();
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
            <Show when={bookAttributes()}>
                <iframe
                    src={`${bookAttributes()?.dirname}/${firstPage()}`}
                    class="book-frame"
                    sandbox="allow-same-origin allow-scripts"
                    onLoad={frameContentLoadHandler}
                    // onMessage={() => {}}
                />
            </Show>
        </div>
    );
}