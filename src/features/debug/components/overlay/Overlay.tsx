import { useCallback } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
} from 'src/design-system/components';
import { db } from 'src/controllers';
import { useBookFrameStateSelect } from 'src/features/book-frame/state';
import { debugStateMachineActor, useDebugStateMatch } from '../../state';

export default function Overlay() {
    const screenRect = useBookFrameStateSelect('screenRect');
    const chapterRect = useBookFrameStateSelect('chapterRect');
    const scrollPosition = useBookFrameStateSelect('scrollPosition');
    const isVisible = useDebugStateMatch(['VISIBLE']);

    const closeHandler = useCallback(() => {
        debugStateMachineActor.send({ type: 'HIDE' });
    }, []);
    
    const disableDebugHandler = useCallback(() => {
        debugStateMachineActor.send({ type: 'DISABLE' });
        window.location.reload();
    }, []);
    
    const clearLibraryDBTableHandler = useCallback(async () => {
        await db.execute('DELETE FROM "books"');
        window.location.reload();
    }, []);
    
    const clearDictionaryDBTableHandler = useCallback(async () => {
        await db.execute('DELETE FROM "dictionary-words"');
        window.location.reload();
    }, []);

    const clearDBHandler = useCallback(async () => {
        await db.deleteDB();
        window.location.reload();
    }, []);

    if (!isVisible) {
        return null;
    }

    return (
        <Dialog
            open={isVisible}
            onClose={closeHandler}
        >
            <DialogTitle>Debug</DialogTitle>
            <DialogContent>
                <Box>
                    Screen size: {screenRect.width}x{screenRect.height}
                </Box>
                <Box>
                    Chapter size: {chapterRect.width}x{chapterRect.height}
                </Box>
                <Box>
                    Scroll position: {scrollPosition}
                </Box>

                <Box sx={{ mt: 1 }}>
                    <Button
                        variant="outlined"
                        color="error"
                        sx={{ mr: 1, mb: 1 }}
                        onClick={clearLibraryDBTableHandler}
                    >
                        Clear library table
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        sx={{ mr: 1, mb: 1 }}
                        onClick={clearDictionaryDBTableHandler}
                    >
                        Clear dictionary table
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        sx={{ mr: 1, mb: 1 }}
                        onClick={clearDBHandler}
                    >
                        Clear DB
                    </Button>
                </Box>

                <Button
                    variant="outlined"
                    sx={{ mt: 1 }}
                    onClick={disableDebugHandler}
                >
                    Disable debug
                </Button>
            </DialogContent>
        </Dialog>
    );
}
