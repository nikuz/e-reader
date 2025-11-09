import { useCallback } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
} from 'src/design-system/components';
import { libraryStateMachineActor } from 'src/features/library/state';
import { useBookFrameStateSelect } from 'src/features/book-frame/state';
import { dictionaryStateMachineActor } from 'src/features/dictionary/state';
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
    
    const clearLibraryDBHandler = useCallback(() => {
        libraryStateMachineActor.send({ type: 'CLEAR_DATABASE' });
    }, []);
    
    const clearDictionaryDBHandler = useCallback(() => {
        dictionaryStateMachineActor.send({ type: 'CLEAR_DATABASE' });
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
                        sx={{ mr: 1 }}
                        onClick={clearLibraryDBHandler}
                    >
                        Clear library DB
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={clearDictionaryDBHandler}
                    >
                        Clear dictionary DB
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
