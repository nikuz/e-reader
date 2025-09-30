import { Show } from 'solid-js';
import { Toast, Spinner } from 'src/components';
import { AddBookButton } from './components';
import {
    libraryStateMachineActor,
    useLibraryStateMatch,
    useLibraryStateSelect,
} from './state';

export default function Library() {
    const isOpeningFile = useLibraryStateMatch(['INITIATING', 'OPENING_FILE']);
    const errorMessage = useLibraryStateSelect('errorMessage');

    const closeErrorHandler = () => {
        libraryStateMachineActor.send({ type: 'CLOSE_ERROR_TOAST' });
    };
    
    return (
        <div class="w-full h-full">
            <h1 class="text-center mt-2 text-lg">Library</h1>
            <AddBookButton />

            <Show when={isOpeningFile()}>
                <Spinner size="xl" color="accent" blocker />
            </Show>

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
        </div>
    );
}