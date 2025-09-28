import { useNavigate, useLocation } from '@solidjs/router';
import { VsLibrary } from 'solid-icons/vs';
import { AiFillRead } from 'solid-icons/ai';
import { BsViewList } from 'solid-icons/bs';
import { VsSettings } from 'solid-icons/vs';
import { Routes } from 'src/types';

export default function TabBar() {
    const navigate = useNavigate();
    const location = useLocation();

    const navigateHandler = (route: string) => {
        navigate(route);
    };

    return (
        <div class="dock">
            <button
                classList={{ 'dock-active': location.pathname === Routes.LIBRARY }}
                onClick={[navigateHandler, Routes.LIBRARY]}
            >
                <VsLibrary />
                <span class="dock-label">Library</span>
            </button>

            <button
                classList={{ 'dock-active': location.pathname === Routes.BOOK }}
                onClick={[navigateHandler, Routes.BOOK]}
            >
                <AiFillRead />
                <span class="dock-label">Book</span>
            </button>

            <button
                classList={{ 'dock-active': location.pathname === Routes.DICTIONARY }}
                onClick={[navigateHandler, Routes.DICTIONARY]}
            >
                <BsViewList />
                <span class="dock-label">Dictionary</span>
            </button>

            <button
                classList={{ 'dock-active': location.pathname === Routes.SETTINGS }}
                onClick={[navigateHandler, Routes.SETTINGS]}
            >
                <VsSettings />
                <span class="dock-label">Settings</span>
            </button>
        </div>
    );
}