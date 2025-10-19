import { Switch, Match } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import {
    Toast,
    PageLoader,
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Slide,
} from 'src/design-system/components';
import { ArrowBackIosNewIcon } from 'src/design-system/icons';
import {
    BookFrameIFrame,
    BookFrameSettings,
    BookFrameTabBar,
} from './components';
import { SettingsWatcher } from './settings-watcher';
import { Routes } from 'src/router/constants';
import {
    useBookFrameStateSelect,
    useBookLoaderStateMatch,
    bookFrameStateMachineActor,
} from './state';

export default function BookFrame() {
    const navigate = useNavigate();
    const chapterUrl = useBookFrameStateSelect('chapterUrl');
    const bookAttributes = useBookFrameStateSelect('bookAttributes');
    const bookLoadErrorMessage = useBookFrameStateSelect('errorMessage');
    const menuPanelsVisible = useBookFrameStateSelect('menuPanelsVisible');
    const bookIsLoading = useBookLoaderStateMatch(['LOADING_BOOK']);

    const navigateToLibraryHandler = () => {
        navigate(Routes.LIBRARY);
        bookFrameStateMachineActor.send({ type: 'HIDE_MENU_PANELS' });
    };
    
    const closeErrorHandler = () => {
        bookFrameStateMachineActor.send({ type: 'CLOSE_BOOK_LOAD_ERROR' });
    };

    return <>
        <Slide direction="down" in={menuPanelsVisible()}>
            <AppBar position="absolute">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={navigateToLibraryHandler}
                    >
                        <ArrowBackIosNewIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        {bookAttributes()?.title}
                    </Typography>
                    <BookFrameSettings />
                </Toolbar>
            </AppBar>
        </Slide>
        
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
                    withToolbar
                    onClose={closeErrorHandler}
                />
            </Match>

            <Match when={chapterUrl()}>
                <BookFrameIFrame />
            </Match>
        </Switch>

        <BookFrameTabBar />

        <SettingsWatcher />
    </>;
}