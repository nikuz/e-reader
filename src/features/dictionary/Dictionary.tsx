import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Toast,
} from 'src/design-system/components';
import { ArrowBackIosNewIcon, SettingsIcon } from 'src/design-system/icons';
import { statusBarStateMachineActor } from 'src/features/status-bar/state';
import { WordsList, WordsListCounter, SearchField } from './components';
import { dictionaryStateMachineActor, useDictionaryStateSelect } from './state';

export default function Dictionary() {
    const navigate = useNavigate();
    const errorMessage = useDictionaryStateSelect('errorMessage');

    useEffect(() => {
        dictionaryStateMachineActor.send({ type: 'INITIALIZE' });
        statusBarStateMachineActor.send({ type: 'SHOW' });

        return () => {
            dictionaryStateMachineActor.send({ type: 'CLEANUP' });
        };
    }, []);

    const navigateToLibraryHandler = () => {
        navigate(-1);
    };

    const closeErrorHandler = useCallback(() => {
        dictionaryStateMachineActor.send({ type: 'CLEAR_ERROR_MESSAGE' });
    }, []);

    return (
        <Box
            className="h-full grid grid-rows-[auto_1fr]"
            sx={{
                padding: 'env(safe-area-inset-top) 0 env(safe-area-inset-bottom) 0',
            }}
        >
            <AppBar position="static">
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

            <Box className="grid grid-rows-[auto_auto_1fr] overflow-hidden">
                <SearchField />
                <WordsListCounter />
                <WordsList />
            </Box>

            {errorMessage && (
                <Toast
                    color="error"
                    withToolbar
                    onClose={closeErrorHandler}
                >
                    {errorMessage}
                </Toast>
            )}
        </Box>
    );
}
