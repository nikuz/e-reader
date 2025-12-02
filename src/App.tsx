import { useRef, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Paper } from 'src/design-system/components';
import { ThemeProvider, darkTheme } from 'src/design-system/styles';
import { useLibraryStateSelect } from 'src/features/library/state';
import { bookFrameStateMachineActor } from 'src/features/book-frame/state';
import { screenStateMachineActor } from 'src/features/screen/state';
import { OrientationChangeWatcher } from 'src/features/screen/daemons';
import { RouterPath } from 'src/router/constants';
import Debug from './features/debug';
import './App.css';

export default function App() {
    const navigate = useNavigate();
    const location = useLocation();
    const lastSelectedBook = useLibraryStateSelect('lastSelectedBook');
    const hasPerformedInitialRedirect = useRef(false);

    useEffect(() => {
        if (hasPerformedInitialRedirect.current) {
            return;
        }
        hasPerformedInitialRedirect.current = true;

        if (lastSelectedBook) {
            bookFrameStateMachineActor.send({
                type: 'LOAD_BOOK',
                book: lastSelectedBook,
            });
        }
        
        if (location.pathname === RouterPath.HOME) {
            navigate(
                lastSelectedBook ? RouterPath.BOOK : RouterPath.LIBRARY,
                { replace: true }
            );
        }
    }, [lastSelectedBook, location, navigate]);

    useEffect(() => {
        screenStateMachineActor.send({ type: 'KEEP_AWAKE' });

        () => screenStateMachineActor.send({ type: 'ALLOW_SLEEP' });
    }, []);

    return (
        <ThemeProvider theme={darkTheme}>
            <Paper
                square
                elevation={0}
                className="relative h-full overflow-hidden"
            >
                <Outlet />
                <OrientationChangeWatcher />
                <Debug />
            </Paper>
        </ThemeProvider>
    );
}
