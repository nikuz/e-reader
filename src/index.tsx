import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AppRouter from './router';

const container = document.getElementById('root');

if (container) {
    const root = createRoot(container);
    root.render(
        <StrictMode>
            <AppRouter />
        </StrictMode>,
    );
}
