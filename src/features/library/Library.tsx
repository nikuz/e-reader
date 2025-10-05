import { Show, For } from 'solid-js';
import { Toast, Spinner } from 'src/components';
import { BookCard, AddBookButton } from './components';
import { StateSupplier } from './daemons';
import {
    libraryStateMachineActor,
    useLibraryStateMatch,
    useLibraryStateSelect,
} from './state';

export default function Library() {
    const isInitiating = useLibraryStateMatch(['INITIATING']);
    const isOpeningFile = useLibraryStateMatch(['OPENING_FILE']);
    const storedBooks = useLibraryStateSelect('storedBooks');
    const errorMessage = useLibraryStateSelect('errorMessage');

    const closeErrorHandler = () => {
        libraryStateMachineActor.send({ type: 'CLOSE_ERROR_TOAST' });
    };

    return (
        <div class="h-full">
            <h1 class="text-center mt-2 text-lg">Library</h1>

            <Show when={isInitiating() || isOpeningFile()}>
                <Spinner size="xl" color="accent" blocker />
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
                    class="mt-10"
                    onClose={closeErrorHandler}
                />
            </Show>

            <AddBookButton />

            <StateSupplier />
        </div>
    );
}