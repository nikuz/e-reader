import { useEffect } from 'react';
import { Box, AppBar, Toolbar, Typography, PageLoader, Toast } from 'src/design-system/components';
import { DictionaryInvokeButton } from 'src/features/dictionary/components';
import { statusBarStateMachineActor } from 'src/features/status-bar/state';
import { BookCard, AddBookButton } from './components';
import { StateSupplier } from './daemons';
import {
    libraryStateMachineActor,
    useLibraryStateMatch,
    useLibraryStateSelect,
} from './state';

export default function Library() {
    const isInitiating = useLibraryStateMatch(['INITIALIZING']);
    const isOpeningFile = useLibraryStateMatch([{ INITIALIZED: 'OPENING_FILE' }]);
    const isRemovingBook = useLibraryStateMatch([{ INITIALIZED: 'REMOVING_BOOK' }]);
    const storedBooks = useLibraryStateSelect('storedBooks');
    const errorMessage = useLibraryStateSelect('errorMessage');
    const isLoading = isInitiating || isOpeningFile || isRemovingBook;
    
    const closeErrorHandler = () => {
        libraryStateMachineActor.send({ type: 'CLOSE_ERROR_TOAST' });
    };

    useEffect(() => {
        libraryStateMachineActor.send({ type: 'LOAD_BOOKS' });
    }, []);

    useEffect(() => {
        statusBarStateMachineActor.send({ type: 'SHOW' });
    }, []);

    return (
        <Box
            className="h-full"
            sx={{
                padding: 'env(safe-area-inset-top) 0 env(safe-area-inset-bottom) 0',
            }}
        >
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Library
                    </Typography>
                    <DictionaryInvokeButton />
                </Toolbar>
            </AppBar>

            {isLoading && <PageLoader />}

            <div className="grid gap-4 p-4 grid-cols-[repeat(auto-fill,minmax(150px,1fr))]">
                {storedBooks.map((item) => (
                    <BookCard key={item.eisbn} book={item} />
                ))}
            </div>

            {errorMessage && (
                <Toast
                    color="error"
                    withToolbar
                    onClose={closeErrorHandler}
                >
                    {errorMessage}
                </Toast>
            )}

            <AddBookButton />

            <StateSupplier />
        </Box>
    );
}
