import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Toast, PageLoader } from 'src/design-system/components';
import { DictionaryInvokeButton } from 'src/features/dictionary/components';
import { RouterPath } from 'src/router/constants';
import {
    BookFrameTopMenu,
    BookFrameIFrame,
    BookFrameSettings,
    BookFrameTabBar,
    BookFrameTextSelectionControls,
    TranslationPopper,
    BookFrameNavigation,
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
    
    const hideMenuHandler = useCallback(() => {
        bookFrameStateMachineActor.send({ type: 'HIDE_MENU_PANELS' });
    }, []);

    return (
        <Box
            className="h-full bg-black"
            sx={{
                padding: 'env(safe-area-inset-top) 0 env(safe-area-inset-bottom) 0',
            }}
        >
            <BookFrameTopMenu>
                <DictionaryInvokeButton onClick={hideMenuHandler} />
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
                <BookFrameIFrame />
            )}

            <BookFrameTextSelectionControls />
            <TranslationPopper />
            <BookFrameNavigation />

            <BookFrameTabBar />

            <SettingsWatcher />
        </Box>
    );
}
