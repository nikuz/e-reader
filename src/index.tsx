import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import SettingsProvider from './features/settings';
import { LibraryProvider } from './features/library';
import AppRouter from './router';

const container = document.getElementById('root');

if (container) {
    const root = createRoot(container);
    root.render(
        <StrictMode>
            <SettingsProvider>
                <LibraryProvider>
                    <AppRouter />
                </LibraryProvider>
            </SettingsProvider>
        </StrictMode>,
    );
}
