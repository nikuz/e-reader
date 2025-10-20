import { Toast, PageLoader } from 'src/design-system/components';
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
    const chapterUrl = useBookFrameStateSelect('chapterUrl');
    const bookLoadErrorMessage = useBookFrameStateSelect('errorMessage');
    const bookIsLoading = useBookLoaderStateMatch(['LOADING_BOOK']);

    const closeErrorHandler = () => {
        bookFrameStateMachineActor.send({ type: 'CLOSE_BOOK_LOAD_ERROR' });
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
