import { useNavigate, useLocation } from '@solidjs/router';
import { BottomNavigation, BottomNavigationAction } from 'src/design-system/components';
import {
    LocalLibraryIcon,
    MenuBookIcon,
    ViewListIcon,
    TuneIcon,
} from 'src/design-system/icons';
import { Routes } from 'src/router/constants';

export default function TabBar() {
    const navigate = useNavigate();
    const location = useLocation();

    const changeHandler = (_: any, route: string) => {
        navigate(route);
    };

    return (
        <BottomNavigation
            value={location.pathname}
            showLabels
            class="absolute left-0 right-0 bottom-0"
            onChange={changeHandler}
        >
            <BottomNavigationAction
                label="Library"
                icon={<LocalLibraryIcon />}
                value={Routes.LIBRARY}
            />

            <BottomNavigationAction
                label="Book"
                icon={<MenuBookIcon />}
                value={Routes.BOOK}
            />

            <BottomNavigationAction
                label="Dictionary"
                icon={<ViewListIcon />}
                value={Routes.DICTIONARY}
            />

            <BottomNavigationAction
                label="Settings"
                icon={<TuneIcon />}
                value={Routes.SETTINGS}
            />
        </BottomNavigation>
    );
}