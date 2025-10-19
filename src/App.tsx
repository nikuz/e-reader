import { createEffect, Show } from 'solid-js';
import type { JSX } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { Paper, PageLoader } from 'src/design-system/components';
import { ThemeProvider, darkTheme } from 'src/design-system/styles';
import { useLibraryStateSelect, useLibraryStateMatch } from 'src/features/library/state';
import { bookFrameStateMachineActor } from 'src/features/book-frame/state';
import { Routes } from 'src/router/constants';
import Debug from './features/debug';
import './App.css';

interface Props {
    children?: JSX.Element,
}

export default function App(props: Props) {
    const navigate = useNavigate();
    const isLibraryInitializing = useLibraryStateMatch(['INITIALIZING']);
    const lastSelectedBook = useLibraryStateSelect('lastSelectedBook');

    createEffect(() => {
        const selectedBookAttributes = lastSelectedBook();
        if (selectedBookAttributes && location.pathname !== Routes.LIBRARY) {
            bookFrameStateMachineActor.send({
                type: 'LOAD_BOOK',
                bookAttributes: selectedBookAttributes,
            });
            navigate(Routes.BOOK);
        } else if (location.pathname !== Routes.LIBRARY) {
            navigate(Routes.LIBRARY);
        }
    });

    return (
        <ThemeProvider theme={darkTheme}>
            <Paper
                square
                elevation={0}
                class="h-full overflow-hidden"
                sx={{
                    padding: 'env(safe-area-inset-top) 0 env(safe-area-inset-bottom) 0',
                }}
            >
                <Show when={isLibraryInitializing()}>
                    <PageLoader />
                </Show>
                {props.children}
                <Debug />
            </Paper>
        </ThemeProvider>
    );
};
