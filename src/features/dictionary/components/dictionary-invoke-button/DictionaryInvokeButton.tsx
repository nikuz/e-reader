import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from 'src/design-system/components';
import type { SxProps } from 'src/design-system/styles';
import { TranslateIcon, } from 'src/design-system/icons';
import { RouterPath } from 'src/router/constants';

interface Props {
    sx?: SxProps,
    onClick?: () => void,
}

export function DictionaryInvokeButton(props: Props) {
    const { onClick } = props;
    const navigate = useNavigate();

    const clickHandler = useCallback(() => {
        navigate(RouterPath.DICTIONARY);
        onClick?.();
    }, [navigate, onClick]);

    return (
        <IconButton
            size="large"
            edge="end"
            color="inherit"
            aria-label="menu"
            sx={{ ml: 2, ...props.sx }}
            onClick={clickHandler}
        >
            <TranslateIcon />
        </IconButton>
    );
}
