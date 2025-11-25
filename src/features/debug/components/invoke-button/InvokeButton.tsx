import { IconButton } from 'src/design-system/components';
import { debugStateMachineActor } from '../../state';

export function DebugInvokeButton() {
    const isDebugEnabled = localStorage.getItem('debug') === 'true';

    if (!isDebugEnabled) {
        return null;
    }

    const handleClick = () => {
        debugStateMachineActor.send({ type: 'SHOW' });
    };

    return (
        <IconButton onClick={handleClick}>
            🐛
        </IconButton>
    );
}
