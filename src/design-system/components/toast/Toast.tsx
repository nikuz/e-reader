import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import type { AlertProps } from '@mui/material/Alert';
import type { Theme } from '@mui/material/styles';

export interface Props extends AlertProps {
    className?: string,
    withToolbar?: boolean,
    onClose?: () => void,
}

export function Toast({ children, color, className, withToolbar, onClose }: Props) {
    return (
        <Snackbar
            open
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            className={className}
            sx={{
                marginTop: (theme: Theme) => (withToolbar ? `${theme.mixins.toolbar.minHeight}px` : 0),
            }}
            onClose={onClose}
        >
            <Alert severity={color} onClose={onClose}>
                {children}
            </Alert>
        </Snackbar>
    );
}
