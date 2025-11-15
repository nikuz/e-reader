import { useCallback, useEffect } from 'react';
import MUIDrawer from '@mui/material/SwipeableDrawer';
import {
    useBookFrameStateSelect,
    useBookFrameStateMatch,
    bookFrameStateMachineActor,
} from '../../state';

export function BookFrameNavigationEpub3() {
    const book = useBookFrameStateSelect('book');
    const navigationOpened = useBookFrameStateMatch(['NAVIGATION_OPENED']);

    const frameContentLoadHandler = useCallback(() => {
        
    }, []);

    const closeHandler = useCallback(() => {
        bookFrameStateMachineActor.send({ type: 'NAVIGATION_CLOSE' });
    }, []);

    useEffect(() => {
        
    }, []);

    if (!book?.navigationEpub3Src) {
        return;
    }

    return (
        <MUIDrawer
            open={navigationOpened}
            anchor="left"
            // keepMounted
            ModalProps={{
                keepMounted: false,
            }}
            disableDiscovery
            disableSwipeToOpen
            onClose={closeHandler}
            onOpen={() => { }}
        >
            <iframe
                src={book.navigationEpub3Src}
                className="w-full h-full border-0 bg-black"
                sandbox="allow-same-origin allow-scripts"
                onLoad={frameContentLoadHandler}
            />
        </MUIDrawer>
    );
}
