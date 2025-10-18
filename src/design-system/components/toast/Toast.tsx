import type { JSX } from 'solid-js';
import Alert from '@suid/material/Alert';

export interface Props {
    message: JSX.Element,
    type: 'info' | 'warn' | 'error',
    class?: string,
    onClose?: () => void,
}

export function Toast(props: Props) {
    const closeHandler = () => {
        props.onClose?.();
    };

    return (
        <div class={`
            absolute
            top-[env(safe-area-inset-top)]
            mt-[10]
            left-1/2 
            -translate-x-1/2
            ${props.class ?? ''}
        `}>
            <Alert
                severity="error"
                onClose={closeHandler}
            >
                {props.message}
            </Alert>
        </div>
    );
}