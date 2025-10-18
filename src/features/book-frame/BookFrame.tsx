import { onCleanup, Switch, Match } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import {
    Button,
    Toast,
    Box,
    Typography,
    PageLoader,
} from 'src/design-system/components';
import { settingsStateMachineActor, useSettingsStateSelect } from 'src/features/settings/state';
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
                    <PageLoader />
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
                    <Box class="flex flex-col">
                        <Typography marginBottom={1}>
                            Select book to display
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={navigateToLibraryHandler}
                        >
                            Go to Library
                        </Button>
                    </Box>
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

            <Box class="absolute right-0 top-[env(safe-area-inset-top)]" sx={{ background: '#000' }}>
                <Button variant="outlined" size="small" onClick={increaseFontSizeHandler}>Increase font size</Button>
                <Button variant="outlined" size="small" onClick={decreaseFontSizeHandler}>Decrease font size</Button>
            </Box>

            <SettingsWatcher />
        </div>
    );
}