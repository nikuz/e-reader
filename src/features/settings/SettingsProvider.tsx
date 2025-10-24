import { PageLoader } from 'src/design-system/components';
import { useSettingsStateMatch } from './state';

interface Props {
    children: React.ReactElement,
}

export default function SettingsProvider(props: Props) {
    const isSettingsInitializing = useSettingsStateMatch(['INITIALIZING']);

    if (isSettingsInitializing) {
        return <PageLoader />;
    }

    return props.children;
}