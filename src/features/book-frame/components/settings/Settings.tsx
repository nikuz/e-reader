import { useRef, useEffect } from 'react';
import {
    Box,
    IconButton,
    List,
    ListItem,
    Typography,
    Drawer,
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
} from 'src/features/settings/components';

export function BookFrameSettings() {
    const closeTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
    const marginSides = ['left', 'right', 'top', 'bottom'] as const;

    useEffect(() => {
        return () => clearTimeout(closeTimerRef.current);
    }, []);

    return (
        <Drawer
            keepMounted
            anchor="right"
            content={(
                <Box className="w-[50vw]">
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
                </Box>
            )}
        >
            <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="menu"
                sx={{ ml: 2 }}
            >
                <SettingsIcon />
            </IconButton>
        </Drawer>
    );
}