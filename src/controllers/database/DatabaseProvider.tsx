import { useRef, useEffect, useState } from 'react';
import { PageLoader } from 'src/design-system/components/page-loader/PageLoader';
import { initializeDatabase } from './instance';

interface DatabaseProviderProps {
    children: React.ReactElement;
}

export function DatabaseProvider({ children }: DatabaseProviderProps) {
    const [isInitialized, setIsInitialized] = useState(false);
    const initializationRequested = useRef(false);

    useEffect(() => {
        if (initializationRequested.current) {
            return;
        }
        initializationRequested.current = true;
        
        initializeDatabase()
            .then(() => {
                setIsInitialized(true);
                initializationRequested.current = false;
            })
            .catch((error) => {
                console.error('Failed to initialize database:', error);
                initializationRequested.current = false;
            });
    }, []);

    if (!isInitialized) {
        return <PageLoader />;
    }

    return children;
}
