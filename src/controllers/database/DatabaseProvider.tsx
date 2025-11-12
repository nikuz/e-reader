import { useEffect, useState, type ReactNode } from 'react';
import { PageLoader } from 'src/design-system/components/page-loader/PageLoader';
import { initializeDatabase } from './instance';

interface DatabaseProviderProps {
    children: ReactNode;
}

export function DatabaseProvider({ children }: DatabaseProviderProps) {
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        initializeDatabase()
            .then(() => {
                setIsInitialized(true);
            })
            .catch((error) => {
                console.error('Failed to initialize database:', error);
            });
    }, []);

    if (!isInitialized) {
        return <PageLoader />;
    }

    return children;
}
