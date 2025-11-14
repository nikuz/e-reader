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
import { useBookFrameStateSelect } from '../../state';
import { useCallback } from 'react';

export function BookFrameTabBar() {
    const menuPanelsVisible = useBookFrameStateSelect('menuPanelsVisible');
    const screenOrientation = useScreenOrientationStateSelect('orientation');

    const changeHandler = useCallback((_: React.SyntheticEvent, value: string) => {
        switch (value) {
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
