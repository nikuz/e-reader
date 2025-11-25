import { Overlay } from './components';
import { useDebugStateSelect } from './state';

export default function Debug() {
    const debugEnabled = useDebugStateSelect('enabled');

    if (!debugEnabled) {
        return null;
    }

    return <Overlay />;
}
