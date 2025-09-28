import { Router, Route } from '@solidjs/router';
import App from './App';
import Library from './features/library';
import BookFrame from './features/book-frame';
import Dictionary from './features/dictionary';
import Settings from './features/settings';
import { Routes } from './types';

export default function AppRouter() {
    return (
        <Router>
            <Route path={Routes.HOME} component={App}>
                <Route path={Routes.LIBRARY} component={Library} />
                <Route path={Routes.BOOK} component={BookFrame} />
                <Route path={Routes.DICTIONARY} component={Dictionary} />
                <Route path={Routes.SETTINGS} component={Settings} />
            </Route>
        </Router>
    );
}