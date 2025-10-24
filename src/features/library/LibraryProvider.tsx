import { PageLoader } from 'src/design-system/components';
import { useLibraryStateMatch } from './state';

interface Props {
    children: React.ReactElement,
}

export default function LibraryProvider(props: Props) {
    const isLibraryInitializing = useLibraryStateMatch(['INITIALIZING']);
    
    if (isLibraryInitializing) {
        return <PageLoader />;
    }

    return props.children;
}