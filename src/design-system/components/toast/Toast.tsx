import type { JSX } from 'solid-js';
import Box from '@suid/material/Box';
import Alert from '@suid/material/Alert';

export interface Props {
    message: JSX.Element,
    type: 'info' | 'warn' | 'error',
    class?: string,
    withToolbar?: boolean,
    onClose?: () => void,
}

export function Toast(props: Props) {
    const closeHandler = () => {
        props.onClose?.();
    };

    return (
        <Box
            class={`
                absolute
                top-[env(safe-area-inset-top)]
                mt-5
                left-1/2 
                -translate-x-1/2
                ${props.class ?? ''}
            `}
            sx={{
                top: (theme) => props.withToolbar
                    ? theme.mixins.toolbar.minHeight
                    : 0,
            }}
        >
            <Alert
                severity="error"
                onClose={closeHandler}
            >
                {props.message}
            </Alert>
        </Box>
    );
}