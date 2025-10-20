import { useNavigate } from 'react-router-dom';
import {
    BottomNavigation,
    BottomNavigationAction,
    Slide,
    Fade,
} from 'src/design-system/components';
import {
    FormatListBulletedIcon,
    SearchIcon,
    TranslateIcon,
    MoreHorizIcon,
} from 'src/design-system/icons';
import { RouterPath } from 'src/router/constants';
import {
    useBookFrameStateSelect,
    bookFrameStateMachineActor,
} from '../../state';

export function BookFrameTabBar() {
    const menuPanelsVisible = useBookFrameStateSelect('menuPanelsVisible');
    const navigate = useNavigate();

    const changeHandler = (_: React.SyntheticEvent, value: string) => {
        if (value === 'dictionary') {
            navigate(RouterPath.DICTIONARY);
            bookFrameStateMachineActor.send({ type: 'HIDE_MENU_PANELS' });
        }
    };

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
                            icon={<SearchIcon />}
                            value="search"
                        />

                        <BottomNavigationAction
                            icon={<TranslateIcon />}
                            value="dictionary"
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
