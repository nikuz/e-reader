import { useEffect } from 'react';
import { Box, AppBar, Toolbar, Typography, PageLoader, Toast } from 'src/design-system/components';
import { DictionaryInvokeButton } from 'src/features/dictionary/components';
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
    const isLoading = isInitiating || isOpeningFile || isRemovingBook;
    
    const closeErrorHandler = () => {
        libraryStateMachineActor.send({ type: 'CLOSE_ERROR_TOAST' });
    };

    useEffect(() => {
        libraryStateMachineActor.send({ type: 'LOAD_BOOKS' });
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

            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
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
