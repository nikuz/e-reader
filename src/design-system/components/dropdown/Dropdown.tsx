import { createSignal, type JSX } from 'solid-js';
import Popover, { type PopoverProps } from '@suid/material/Popover';

interface Props extends Omit<PopoverProps, 'onClose' | 'children' | 'open'> {
    content: JSX.Element | ((close: () => void) => JSX.Element);
    children: JSX.Element;
    id?: string;
    onClose?: () => void,
}

export function Dropdown(props: Props) {
    const [anchorEl, setAnchorEl] = createSignal<HTMLElement | null>(null);

    const isOpen = () => Boolean(anchorEl());

    const id = () => (isOpen() ? props.id ?? 'dropdown-popover' : undefined);

    const closeHandler = () => {
        setAnchorEl(null);
        props.onClose?.();
    };

    return <>
        <span
            aria-describedby={id()}
            class="inline-flex"
            onClick={(e) => setAnchorEl(e.currentTarget)}
        >
            {props.children}
        </span>
        <Popover
            {...props}
            id={id()}
            open={isOpen()}
            anchorEl={anchorEl()}
            anchorOrigin={props.anchorOrigin ?? {
                vertical: 'bottom',
                horizontal: 'left',
            }}
            onClose={closeHandler}
        >
            {typeof props.content === 'function'
                ? props.content(closeHandler)
                : props.content
            }
        </Popover>
    </>;
}