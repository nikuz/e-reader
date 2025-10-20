import { useState } from 'react';
import Popover, { type PopoverProps } from '@mui/material/Popover';

interface Props extends Omit<PopoverProps, 'onClose' | 'open' | 'content'> {
    content: React.ReactNode | ((close: () => void) => React.ReactNode),
    onClose?: () => void,
}

export function Dropdown({
    content,
    children,
    onClose,
    anchorOrigin,
    ...popoverProps
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
        <Popover
            {...popoverProps}
            open={!!anchorEl}
            anchorEl={anchorEl}
            anchorOrigin={anchorOrigin ?? {
                vertical: 'bottom',
                horizontal: 'left',
            }}
            onClose={closeHandler}
        >
            {typeof content === 'function' ? content(closeHandler) : content}
        </Popover>
    </>;
}
