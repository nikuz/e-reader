import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Toast, PageLoader } from 'src/design-system/components';
import { DictionaryInvokeButton } from 'src/features/dictionary/components';
import { statusBarStateMachineActor } from 'src/features/status-bar/state';
import { RouterPath } from 'src/router/constants';
import {
    BookFrameTopMenu,
    BookFrameIFrame,
    BookFrameSettings,
    BookFrameTabBar,
    BookFrameTextSelectionControls,
    BookFrameTranslationPopper,
    BookFrameNavigation,
    BookFrameStats,
} from './components';
import { SettingsWatcher } from './settings-watcher';
import {
    useBookFrameStateSelect,
    useBookLoaderStateMatch,
    bookFrameStateMachineActor,
} from './state';

export default function BookFrame() {
    const navigate = useNavigate();
    const chapterUrl = useBookFrameStateSelect('chapterUrl');
    const bookLoadErrorMessage = useBookFrameStateSelect('errorMessage');
    const bookIsLoading = useBookLoaderStateMatch(['LOADING_BOOK']);

    const closeErrorHandler = useCallback(() => {
        bookFrameStateMachineActor.send({ type: 'CLOSE_BOOK_LOAD_ERROR' });
        navigate(RouterPath.LIBRARY);
    }, [navigate]);
    
    useEffect(() => {
        bookFrameStateMachineActor.send({ type: 'HIDE_MENU_PANELS' });
        statusBarStateMachineActor.send({ type: 'HIDE' });
    }, []);

    return (
        <Box
            className="h-full bg-black"
            sx={{
                padding: 'env(safe-area-inset-top) 0 env(safe-area-inset-bottom) 0',
            }}
        >
            <BookFrameTopMenu>
                <DictionaryInvokeButton />
                <BookFrameSettings />
            </BookFrameTopMenu>

            {bookIsLoading && (
                <PageLoader />
            )}

            {!bookIsLoading && bookLoadErrorMessage && (
                <Toast
                    color="error"
                    withToolbar
                    onClose={closeErrorHandler}
                >
                    Book rendering error
                    <br />
                    {bookLoadErrorMessage}
                </Toast>
            )}

            {!bookIsLoading && !bookLoadErrorMessage && chapterUrl && (
                <Box className="grid grid-rows-[1fr_auto] h-full">
                    <BookFrameIFrame />
                    <BookFrameStats />
                </Box>
            )}

            <BookFrameTextSelectionControls />
            <BookFrameTranslationPopper />
            <BookFrameNavigation />

            <BookFrameTabBar />

            <SettingsWatcher />
        </Box>
    );
}
