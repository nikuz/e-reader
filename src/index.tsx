import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { DatabaseProvider } from './controllers/database';
import { FeaturesProvider } from './features';
import SettingsProvider from './features/settings';
import AppRouter from './router';

const container = document.getElementById('root');

if (container) {
    const root = createRoot(container);
    root.render(
        <StrictMode>
            <DatabaseProvider>
                <SettingsProvider>
                    <FeaturesProvider>
                        <AppRouter />
                    </FeaturesProvider>
                </SettingsProvider>
            </DatabaseProvider>
        </StrictMode>,
    );
}
