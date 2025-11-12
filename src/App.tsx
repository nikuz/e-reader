import { useEffect } from 'react';
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
    
    useEffect(() => {
        const libraryStateChangeSubscription = libraryStateMachineActor.subscribe((snapshot) => {
            if (snapshot.context.lastSelectedBook && location.pathname !== RouterPath.LIBRARY) {
                bookFrameStateMachineActor.send({
                    type: 'LOAD_BOOK',
                    book: snapshot.context.lastSelectedBook,
                });
                if (location.pathname !== RouterPath.BOOK) {
                    requestAnimationFrame(() => {
                        navigate(RouterPath.BOOK, { replace: true });
                    });
                }
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
