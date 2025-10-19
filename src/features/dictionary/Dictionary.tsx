import { onMount } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { AppBar, Toolbar, IconButton, Typography } from 'src/design-system/components';
import { ArrowBackIosNewIcon, SettingsIcon } from 'src/design-system/icons';
import { dictionaryStateMachineActor } from './state';

export default function Dictionary() {
    const navigate = useNavigate();

    onMount(() => {
        dictionaryStateMachineActor.send({ type: 'INITIALIZE' });
    });

    const navigateToLibraryHandler = () => {
        navigate(-1);
    };

    return (
        <AppBar position="absolute">
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
                    Dictionary
                </Typography>
                <IconButton
                    size="large"
                    edge="end"
                    color="inherit"
                    aria-label="menu"
                    sx={{ ml: 2 }}
                >
                    <SettingsIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
}