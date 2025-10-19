import { useNavigate } from '@solidjs/router';
import {
    BottomNavigation,
    BottomNavigationAction,
    Slide,
} from 'src/design-system/components';
import {
    FormatListBulletedIcon,
    SearchIcon,
    TranslateIcon,
    MoreHorizIcon,
} from 'src/design-system/icons';
import { Routes } from 'src/router/constants';
import {
    useBookFrameStateSelect,
    bookFrameStateMachineActor,
} from '../../state';

export function BookFrameTabBar() {
    const menuPanelsVisible = useBookFrameStateSelect('menuPanelsVisible');
    const navigate = useNavigate();

    const changeHandler = (_: any, value: string) => {
        if (value === 'dictionary') {
            navigate(Routes.DICTIONARY);
            bookFrameStateMachineActor.send({ type: 'HIDE_MENU_PANELS' });
        }
    };

    return (
        <Slide direction="up" in={menuPanelsVisible()}>    
            <BottomNavigation
                showLabels={false}
                class="absolute left-0 right-0 bottom-0"
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
    );
}