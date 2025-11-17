import { useCallback } from 'react';
import { SwipeableDrawer, Box } from 'src/design-system/components';
import {
    useBookFrameStateSelect,
    useBookFrameStateMatch,
    bookFrameStateMachineActor,
} from '../../state';
import BookFrameNavigationEpub3 from './Epub3';
import BookFrameNavigationEpub2 from './Epub2';

export function BookFrameNavigation() {
    const book = useBookFrameStateSelect('book');
    const navigationOpened = useBookFrameStateMatch(['NAVIGATION_OPENED']);

    const closeHandler = useCallback(() => {
        bookFrameStateMachineActor.send({ type: 'NAVIGATION_CLOSE' });
    }, []);

    if (!book?.navigationEpub3Src && !book?.navigationEpub2Src) {
        return;
    }

    return (
        <SwipeableDrawer
            open={navigationOpened}
            anchor="left"
            ModalProps={{
                keepMounted: false,
            }}
            disableDiscovery
            disableSwipeToOpen
            onClose={closeHandler}
            onOpen={() => { }}
        >
            <Box className="w-[50vw] min-w-sm h-full">
                {book?.navigationEpub3Src && (
                    <BookFrameNavigationEpub3 />
                )}
                {book?.navigationEpub2Src && (
                    <BookFrameNavigationEpub2 />
                )}
            </Box>
        </SwipeableDrawer>
    );
}
