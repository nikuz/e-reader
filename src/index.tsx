import { render } from 'solid-js/web';
import AppRouter from './router';

const root = document.getElementById('root');
if (root) {
    render(() => <AppRouter />, root);
}
