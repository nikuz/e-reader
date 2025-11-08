import { debugStateMachineActor } from '../../state';
import './style.css';

export default function InvokeButton() {
    const isDebugEnabled = localStorage.getItem('debug') === 'true';

    if (!isDebugEnabled) {
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
