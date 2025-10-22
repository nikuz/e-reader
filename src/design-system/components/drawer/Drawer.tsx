import { useState } from 'react';
import Box from '@mui/material/Box';
import MUIDrawer, { type DrawerProps } from '@mui/material/Drawer';

interface Props extends Omit<DrawerProps, 'onClose' | 'open' | 'content'> {
    content: React.ReactNode | React.ReactNode[] | ((close: () => void) => React.ReactNode),
    onClose?: () => void,
}

export function Drawer({
    content,
    children,
    onClose,
    ...drawerProps
}: Props) {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const handleTriggerClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const closeHandler = () => {
        setAnchorEl(null);
        onClose?.();
    };

    return <>
        <span className="inline-flex" onClick={handleTriggerClick}>
            {children}
        </span>
        <MUIDrawer
            {...drawerProps}
            open={!!anchorEl}
            onClose={closeHandler}
        >
            <Box sx={{
                paddingTop: 'env(safe-area-inset-top)',
                paddingBottom: 'env(safe-area-inset-bottom)',
            }}>
                {typeof content === 'function' ? content(closeHandler) : content}
            </Box>
        </MUIDrawer>
    </>;
}
