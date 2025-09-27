import { Router, Route } from '@solidjs/router';
import App from './App';
import BookFrame from './features/book-frame';
import { Routes } from './types';

export default function AppRouter() {
    return (
        <Router>
            <Route path={Routes.HOME} component={App}>
                <Route path={Routes.BOOK} component={BookFrame} />
            </Route>
        </Router>
    );
}