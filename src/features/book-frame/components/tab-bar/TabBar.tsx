import {
    BottomNavigation,
    BottomNavigationAction,
    Slide,
    Fade,
} from 'src/design-system/components';
import {
    FormatListBulletedIcon,
    SearchIcon,
    MoreHorizIcon,
    ScreenLockLandscapeIcon,
    ScreenLockPortraitIcon,
} from 'src/design-system/icons';
import {
    screenOrientationStateMachineActor,
    useScreenOrientationStateSelect,
} from 'src/features/screen-orientation/state';
import { useBookFrameStateSelect, bookFrameStateMachineActor } from '../../state';
import { useCallback } from 'react';

export function BookFrameTabBar() {
    const book = useBookFrameStateSelect('book');
    const menuPanelsVisible = useBookFrameStateSelect('menuPanelsVisible');
    const screenOrientation = useScreenOrientationStateSelect('orientation');
    const isNavigationDisabled = !book?.navigationEpub2Src && !book?.navigationEpub3Src;

    const changeHandler = useCallback((_: React.SyntheticEvent, value: string) => {
        switch (value) {
            case 'navigation':
                bookFrameStateMachineActor.send({ type: 'NAVIGATION_OPEN' });
                break;
            
            case 'rotate':
                if (screenOrientation === 'landscape') {
                    screenOrientationStateMachineActor.send({ type: 'LOCK_PORTRAIT' });
                } else {
                    screenOrientationStateMachineActor.send({ type: 'LOCK_LANDSCAPE' });
                }
                break;
        }
    }, [screenOrientation]);

    return (
        <Fade
            in={menuPanelsVisible}
            timeout={{ enter: 300, exit: 100 }}
        >
            <div>
                <Slide direction="up" in={menuPanelsVisible}>
                    <BottomNavigation
                        showLabels={false}
                        className="absolute left-0 right-0"
                        sx={{
                            bottom: 'env(safe-area-inset-bottom)',
                        }}
                        onChange={changeHandler}
                    >
                        <BottomNavigationAction
                            icon={<FormatListBulletedIcon />}
                            value="navigation"
                            disabled={isNavigationDisabled}
                            sx={{ opacity: isNavigationDisabled ? 0.5 : 1 }}
                        />

                        <BottomNavigationAction
                            icon={
                                screenOrientation === 'landscape'
                                    ? <ScreenLockPortraitIcon />
                                    : <ScreenLockLandscapeIcon />
                            }
                            value="rotate"
                        />

                        <BottomNavigationAction
                            icon={<SearchIcon />}
                            value="search"
                        />

                        <BottomNavigationAction
                            icon={<MoreHorizIcon />}
                            value="more"
                        />
                    </BottomNavigation>
                </Slide>
            </div>
        </Fade>
    );
}
