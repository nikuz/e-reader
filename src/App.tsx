import { createEffect } from 'solid-js';
import type { JSX } from 'solid-js';
import { useLocation, useNavigate } from '@solidjs/router';
import { Paper } from 'src/design-system/components';
import { ThemeProvider, darkTheme } from 'src/design-system/styles';
import { Routes } from 'src/router/constants';
import Debug from './features/debug';
import TabBar from './features/tab-bar';
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
        <ThemeProvider theme={darkTheme}>
            <Paper
                square
                elevation={0}
                class="h-full overflow-hidden"
            >
                {props.children}
                <TabBar />
                <Debug />
            </Paper>
        </ThemeProvider>
    );
};
