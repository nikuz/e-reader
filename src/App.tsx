import { createEffect } from 'solid-js';
import type { JSX } from 'solid-js';
import { useLocation, useNavigate } from '@solidjs/router';
import Debug from './features/debug';
import TabBar from './features/tab-bar';
import { Routes } from './types';
import './App.css';

interface Props {
    children?: JSX.Element,
}

export default function App(props: Props) {
    const location = useLocation();
    const navigate = useNavigate();

    createEffect(() => {
        if (location.pathname === '/') {
            navigate(Routes.LIBRARY);
        }
    });

    return (
        <div class="content">
            {props.children}
            <TabBar />
            <Debug />
        </div>
    );
};
