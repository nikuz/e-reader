import { debugStateMachineActor, useDebugStateMatch } from '../../state';
import './style.css';

export default function InvokeButton() {
    const isDebugEnabled = localStorage.getItem('debug') === 'true';
    const isOverlayVisible = useDebugStateMatch(['VISIBLE']);

    if (!isDebugEnabled || isOverlayVisible) {
        return null;
    }

    const handleClick = () => {
        debugStateMachineActor.send({ type: 'SHOW' });
    };

    return (
        <button className="debug-invoke-button z-99999" onClick={handleClick}>
            🐛
        </button>
    );
}
