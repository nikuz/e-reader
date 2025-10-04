import { createSignal, createEffect, untrack, Show, For } from 'solid-js';
import { Toast, Spinner } from 'src/components';
import { AddBookButton } from './components';
import { StateSupplier } from './daemons';
import {
    libraryStateMachineActor,
    useLibraryStateMatch,
    useLibraryStateSelect,
} from './state';

export default function Library() {
    const [loadTime, setLoadTime] = createSignal<number[]>([]);
    const isInitiating = useLibraryStateMatch(['INITIATING']);
    const isOpeningFile = useLibraryStateMatch(['OPENING_FILE']);
    const errorMessage = useLibraryStateSelect('errorMessage');
    let loadStartTime = 0;

    const closeErrorHandler = () => {
        libraryStateMachineActor.send({ type: 'CLOSE_ERROR_TOAST' });
    };

    createEffect(() => {
        if (isOpeningFile()) {
            loadStartTime = Date.now();
        } else if (loadStartTime && !isOpeningFile()) {
            untrack(() => {
                setLoadTime([
                    ...loadTime(),
                    Date.now() - loadStartTime,
                ]);
            });
        }
    });
    
    return (
        <div class="w-full h-full">
            <h1 class="text-center mt-2 text-lg">Library</h1>
            <AddBookButton />

            <Show when={isInitiating() || isOpeningFile()}>
                <Spinner size="xl" color="accent" blocker />
            </Show>

            <For each={loadTime()}>
                {(item) => (
                    <div>{item}</div>
                )}
            </For>

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

            <StateSupplier />
        </div>
    );
}