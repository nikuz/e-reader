import { useNavigate } from 'react-router-dom';
import { Toast, PageLoader } from 'src/design-system/components';
import { RouterPath } from 'src/router/constants';
import {
    BookFrameTopMenu,
    BookFrameIFrame,
    BookFrameSettings,
    BookFrameTabBar,
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

    const closeErrorHandler = () => {
        bookFrameStateMachineActor.send({ type: 'CLOSE_BOOK_LOAD_ERROR' });
        navigate(RouterPath.LIBRARY);
    };

    return <>
        <BookFrameTopMenu>
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

        <BookFrameTabBar />

        <SettingsWatcher />
    </>;
}
