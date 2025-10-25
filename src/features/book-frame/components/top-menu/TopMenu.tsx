import { useNavigate } from 'react-router-dom';
import {
    Toolbar,
    AppBar,
    IconButton,
    Typography,
    Slide,
    Fade,
} from 'src/design-system/components';
import { ArrowBackIosNewIcon } from 'src/design-system/icons';
import { RouterPath } from 'src/router/constants';
import {
    useBookFrameStateSelect,
    bookFrameStateMachineActor,
} from '../../state';

interface Props {
    children: React.ReactElement,
}

export function BookFrameTopMenu(props: Props) {
    const book = useBookFrameStateSelect('book');
    const menuPanelsVisible = useBookFrameStateSelect('menuPanelsVisible');
    const navigate = useNavigate();

    const navigateToLibraryHandler = () => {
        navigate(RouterPath.LIBRARY);
        bookFrameStateMachineActor.send({ type: 'HIDE_MENU_PANELS' });
    };

    return (
        <Fade
            in={menuPanelsVisible}
            timeout={{ enter: 300, exit: 100 }}
        >
            <div>
                <Slide direction="down" in={menuPanelsVisible}>
                    <AppBar
                        position="absolute"
                        sx={{
                            top: 'env(safe-area-inset-top)',
                        }}
                    >
                        <Toolbar>
                            <IconButton
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                sx={{ mr: 2 }}
                                onClick={navigateToLibraryHandler}
                            >
                                <ArrowBackIosNewIcon />
                            </IconButton>
                            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                {book?.title}
                            </Typography>
                            {props.children}
                        </Toolbar>
                    </AppBar>
                </Slide>
            </div>
        </Fade>
    );
}
