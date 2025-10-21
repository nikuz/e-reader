import {
    Dropdown,
    IconButton,
    List,
    ListItem,
} from 'src/design-system/components';
import { SettingsIcon } from 'src/design-system/icons';
import {
    FontSize,
    FontLineHeight,
    FontColor,
    FontOverrideBookFonts,
    FontFamily,
} from 'src/features/settings/components';

export function BookFrameSettings() {
    return (
        <Dropdown
            content={(
                <List className="w-[50vw]">
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
                </List>
            )}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
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
        </Dropdown>
    );
}
