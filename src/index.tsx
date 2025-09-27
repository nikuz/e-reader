import { render } from 'solid-js/web';
import Router from './Router';

const root = document.getElementById('root');
if (root) {
    render(() => <Router />, root);
}
