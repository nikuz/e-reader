import { Router, Route } from '@solidjs/router';
import App from 'src/App';
import Library from 'src/features/library';
import BookFrame from 'src/features/book-frame';
import Dictionary from 'src/features/dictionary';
import { Routes } from './constants';

export default function AppRouter() {
    return (
        <Router>
            <Route path={Routes.HOME} component={App}>
                <Route path={Routes.LIBRARY} component={Library} />
                <Route path={Routes.BOOK} component={BookFrame} />
                <Route path={Routes.DICTIONARY} component={Dictionary} />
                <Route path="*404" component={() => null} />
            </Route>
        </Router>
    );
}