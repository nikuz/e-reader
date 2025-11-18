import { useRef, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Paper } from 'src/design-system/components';
import { ThemeProvider, darkTheme } from 'src/design-system/styles';
import { libraryStateMachineActor } from 'src/features/library/state';
import { bookFrameStateMachineActor } from 'src/features/book-frame/state';
import { screenStateMachineActor } from 'src/features/screen/state';
import { RouterPath } from 'src/router/constants';
import Debug from './features/debug';
import { OrientationChangeWatcher } from './features/screen/daemons';
import './App.css';

export default function App() {
    const navigate = useNavigate();
    const location = useLocation();
    const initialRedirectFinished = useRef(false);
    
    useEffect(() => {
        const libraryStateChangeSubscription = libraryStateMachineActor.subscribe((snapshot) => {
            if (initialRedirectFinished.current || location.pathname === RouterPath.LIBRARY) {
                return;
            }
            if (snapshot.context.lastSelectedBook) {
                bookFrameStateMachineActor.send({
                    type: 'LOAD_BOOK',
                    book: snapshot.context.lastSelectedBook,
                });
                if (location.pathname !== RouterPath.BOOK) {
                    navigate(RouterPath.BOOK, { replace: true });
                }
                initialRedirectFinished.current = true;
            } else if (snapshot.matches('IDLE')) {
                navigate(RouterPath.LIBRARY, { replace: true });
                initialRedirectFinished.current = true;
            }
        });
        return () => {
            libraryStateChangeSubscription.unsubscribe();
        };
    }, [location, navigate]);

    useEffect(() => {
        libraryStateMachineActor.send({ type: 'LOAD_LAST_SELECTED_BOOK' });
    }, []);
    
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
