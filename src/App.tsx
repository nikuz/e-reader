import { useRef, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Paper } from 'src/design-system/components';
import { ThemeProvider, darkTheme } from 'src/design-system/styles';
import { libraryStateMachineActor } from 'src/features/library/state';
import { bookFrameStateMachineActor } from 'src/features/book-frame/state';
import { RouterPath } from 'src/router/constants';
import Debug from './features/debug';
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

    return (
        <ThemeProvider theme={darkTheme}>
            <Paper
                square
                elevation={0}
                className="relative h-full overflow-hidden"
            >
                <Outlet />
                <Debug />
            </Paper>
        </ThemeProvider>
    );
}
