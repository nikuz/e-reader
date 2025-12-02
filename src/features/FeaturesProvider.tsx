import { useEffect } from 'react';
import { PageLoader } from 'src/design-system/components';
import { libraryStateMachineActor, useLibraryStateMatch } from './library/state';
import { dictionaryStateMachineActor, useDictionaryStateMatch } from './dictionary/state';

interface Props {
    children: React.ReactElement;
}

export function FeaturesProvider({ children }: Props) {
    const libraryIsReady = useLibraryStateMatch(['INITIALIZED']);
    const dictionaryIsReady = useDictionaryStateMatch(['INITIALIZED']);
    const allFeaturesInitialized = libraryIsReady && dictionaryIsReady;

    // initialize features that need to be initialized
    useEffect(() => {
        libraryStateMachineActor.send({ type: 'INITIALIZE' });
        dictionaryStateMachineActor.send({ type: 'INITIALIZE' });
    }, []);

    if (!allFeaturesInitialized) {
        return <PageLoader />;
    }

    return children;
}
