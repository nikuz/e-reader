import { useRef, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Paper } from 'src/design-system/components';
import { ThemeProvider, darkTheme } from 'src/design-system/styles';
import { useLibraryStateSelect } from 'src/features/library/state';
import { bookFrameStateMachineActor } from 'src/features/book-frame/state';
import { RouterPath } from 'src/router/constants';
import Debug from './features/debug';
import './App.css';

export default function App() {
    const navigate = useNavigate();
    const location = useLocation();
    const lastSelectedBook = useLibraryStateSelect('lastSelectedBook');
    const isRouterInitialized = useRef(false);

    useEffect(() => {
        if (isRouterInitialized.current) {
            return;
        }
        isRouterInitialized.current = true;
        
        if (lastSelectedBook && location.pathname !== RouterPath.LIBRARY) {
            bookFrameStateMachineActor.send({
                type: 'LOAD_BOOK',
                book: lastSelectedBook,
            });
            if (location.pathname !== RouterPath.BOOK) {
                navigate(RouterPath.BOOK);
            }
        } else if (!lastSelectedBook && location.pathname !== RouterPath.LIBRARY) {
            navigate(RouterPath.LIBRARY);
        }
    }, [lastSelectedBook, location, navigate]);

    return (
        <ThemeProvider theme={darkTheme}>
            <Paper
                square
                elevation={0}
                className="relative h-full overflow-hidden"
                sx={{
                    padding: 'env(safe-area-inset-top) 0 env(safe-area-inset-bottom) 0',
                }}
            >
                <Outlet />
                <Debug />
            </Paper>
        </ThemeProvider>
    );
}
