import { Show, For } from 'solid-js';
import { AppBar, Toolbar, Typography, PageLoader, Toast } from 'src/design-system/components';
import { BookCard, AddBookButton } from './components';
import { StateSupplier } from './daemons';
import {
    libraryStateMachineActor,
    useLibraryStateMatch,
    useLibraryStateSelect,
} from './state';

export default function Library() {
    const isInitiating = useLibraryStateMatch(['INITIALIZING']);
    const isOpeningFile = useLibraryStateMatch(['OPENING_FILE']);
    const isRemovingBook = useLibraryStateMatch(['REMOVING_BOOK']);
    const storedBooks = useLibraryStateSelect('storedBooks');
    const errorMessage = useLibraryStateSelect('errorMessage');

    const closeErrorHandler = () => {
        libraryStateMachineActor.send({ type: 'CLOSE_ERROR_TOAST' });
    };

    return (
        <div class="h-full">
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Library
                    </Typography>
                </Toolbar>
            </AppBar>

            <Show when={isInitiating() || isOpeningFile() || isRemovingBook()}>
                <PageLoader />
            </Show>

            <div class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
                <For each={storedBooks()}>
                    {(item) => (
                        <BookCard bookAttributes={item} />
                    )}
                </For>
            </div>

            <Show when={errorMessage()}>
                <Toast
                    message={
                        <span>
                            File loading error
                            <br />
                            {errorMessage()}
                        </span>
                    }
                    type="error"
                    withToolbar
                    onClose={closeErrorHandler}
                />
            </Show>

            <AddBookButton />

            <StateSupplier />
        </div>
    );
}
