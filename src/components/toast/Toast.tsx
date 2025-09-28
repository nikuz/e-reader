import { AiOutlineClose } from 'solid-icons/ai';
import './style.css';

export interface Props {
    message: string,
    type: 'info' | 'warn' | 'error',
    onClose?: () => void,
}

export function Toast(props: Props) {
    const closeHandler = () => {
        props.onClose?.();
    };

    return (
        <div class="toast toast-top toast-center">
            <div
                class="alert"
                classList={{
                    'alert-info': props.type === 'info',
                    'alert-warning': props.type === 'warn',
                    'alert-error': props.type === 'error',
                }}
            >
                <span>{props.message}</span>
                <button class="btn rounded-lg btn-xs -m-1" onClick={closeHandler}>
                    <AiOutlineClose size={15} />
                </button>
            </div>
        </div>
    );
}