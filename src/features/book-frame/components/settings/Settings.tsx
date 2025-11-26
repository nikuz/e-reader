import { useCallback } from 'react';
import {
    Box,
    IconButton,
    List,
    ListItem,
    Typography,
    SwipeableDrawer,
    Divider,
} from 'src/design-system/components';
import { SettingsIcon } from 'src/design-system/icons';
import {
    FontSize,
    FontLineHeight,
    FontColor,
    FontOverrideBookFonts,
    FontFamily,
    FontWordSpacing,
    FontLetterSpacing,
    LayoutParagraphMargin,
    LayoutMargin,
    HighlightType,
    HighlightColor,
    DictionaryVoice,
    DictionaryAIVoice,
    DictionaryTryVoice,
    DictionaryShowTranslation,
} from 'src/features/settings/components';
import {
    useBookFrameStateMatch,
    bookFrameStateMachineActor,
} from '../../state';

export function BookFrameSettings() {
    const marginSides = ['left', 'right', 'top', 'bottom'] as const;
    const settingsOpened = useBookFrameStateMatch(['SETTINGS_OPENED']);

    const openHandler = useCallback(() => {
        bookFrameStateMachineActor.send({ type: 'SETTINGS_OPEN' });
    }, []);

    const closeHandler = useCallback(() => {
        bookFrameStateMachineActor.send({ type: 'SETTINGS_CLOSE' });
    }, []);

    return <>
        <IconButton
            size="large"
            edge="end"
            color="inherit"
            aria-label="menu"
            sx={{ ml: 2 }}
            onClick={openHandler}
        >
            <SettingsIcon />
        </IconButton>
        <SwipeableDrawer
            open={settingsOpened}
            anchor="right"
            ModalProps={{
                keepMounted: false,
            }}
            disableDiscovery
            disableSwipeToOpen
            onClose={closeHandler}
            onOpen={() => { }}
        >
            <Box className="w-[50vw] min-w-sm">
                <Typography
                    variant="h6"
                    marginLeft={2}
                    marginTop={1}
                >
                    Fonts
                </Typography>
                <List sx={{ mb: 2 }}>
                    <ListItem>
                        <FontSize />
                    </ListItem>
                    <ListItem>
                        <FontLineHeight />
                    </ListItem>
                    <ListItem>
                        <FontColor />
                    </ListItem>
                    <ListItem>
                        <FontOverrideBookFonts />
                    </ListItem>
                    <ListItem>
                        <FontFamily />
                    </ListItem>
                    <ListItem>
                        <FontWordSpacing />
                    </ListItem>
                    <ListItem>
                        <FontLetterSpacing />
                    </ListItem>
                </List>

                <Divider />

                <Typography
                    variant="h6"
                    marginLeft={2}
                    marginTop={2}
                >
                    Highlight
                </Typography>
                <List sx={{ mb: 2 }}>
                    <ListItem>
                        <HighlightType />
                    </ListItem>
                    <ListItem>
                        <HighlightColor />
                    </ListItem>
                </List>

                <Divider />

                <Typography
                    variant="h6"
                    marginLeft={2}
                    marginTop={2}
                >
                    Layout
                </Typography>
                <List>
                    <ListItem>
                        <LayoutParagraphMargin />
                    </ListItem>
                    {marginSides.map(side => (
                        <ListItem key={side}>
                            <LayoutMargin side={side} />
                        </ListItem>
                    ))}
                </List>
                
                <Divider />
                
                <Typography
                    variant="h6"
                    marginLeft={2}
                    marginTop={2}
                >
                    Dictionary
                </Typography>
                <List>
                    <ListItem>
                        <DictionaryAIVoice />
                    </ListItem>
                    <ListItem>
                        <DictionaryVoice />
                    </ListItem>
                    <ListItem>
                        <DictionaryTryVoice />
                    </ListItem>
                    <ListItem>
                        <DictionaryShowTranslation />
                    </ListItem>
                </List>
            </Box>
        </SwipeableDrawer>
    </>;
}
