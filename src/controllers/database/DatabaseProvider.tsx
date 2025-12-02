import { useRef, useEffect, useState } from 'react';
import { PageLoader } from 'src/design-system/components/page-loader/PageLoader';
import { initializeDatabase } from './instance';

interface Props {
    children: React.ReactElement;
}

export function DatabaseProvider({ children }: Props) {
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
