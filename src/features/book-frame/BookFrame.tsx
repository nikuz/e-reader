import { onCleanup, Switch, Match } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { settingsStateMachineActor, useSettingsStateSelect } from 'src/features/settings/state';
import { Toast, Spinner } from 'src/components';
import { Routes } from 'src/router/constants';
import { SettingsWatcher } from './settings-watcher';
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
    const chapterUrl = useBookFrameStateSelect('chapterUrl');
    const bookLoadErrorMessage = useBookFrameStateSelect('errorMessage');
    const bookIsLoading = useBookLoaderStateMatch(['LOADING_BOOK']);
    const fontSettings = useSettingsStateSelect('font');
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

    const increaseFontSizeHandler = () => {
        settingsStateMachineActor.send({
            type: 'SET_FONT_SIZE',
            value: `${parseInt(fontSettings().fontSize, 10) + 1}px`,
        });
    };
    
    const decreaseFontSizeHandler = () => {
        settingsStateMachineActor.send({
            type: 'SET_FONT_SIZE',
            value: `${parseInt(fontSettings().fontSize, 10) - 1}px`,
        });
    };

    onCleanup(() => {
        eventObserver?.unsubscribe();
    });

    return (
        <div class="book-frame-container">
            <Switch>
                <Match when={bookIsLoading()}>
                    <Spinner size="xl" color="accent" blocker />
                </Match>

                <Match when={bookLoadErrorMessage()}>
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
                </Match>

                <Match when={!book()}>
                    <p class="flex flex-col">
                        Select book to display
                        <button
                            class="btn block rounded-lg mt-2"
                            onClick={navigateToLibraryHandler}
                        >
                            Go to Library
                        </button>
                    </p>
                </Match>

                <Match when={chapterUrl()}>
                    <iframe
                        src={chapterUrl()}
                        class="book-frame"
                        sandbox="allow-same-origin allow-scripts"
                        onLoad={frameContentLoadHandler}
                    />
                </Match>
            </Switch>

            <div class="absolute right-0 top-[env(safe-area-inset-top)]">
                <button class="btn" onClick={increaseFontSizeHandler}>Increase font size</button>
                <button class="btn" onClick={decreaseFontSizeHandler}>Decrease font size</button>
            </div>

            <SettingsWatcher />
        </div>
    );
}