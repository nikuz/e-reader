import {
    Dropdown,
    IconButton,
    List,
    ListItem,
} from 'src/design-system/components';
import { SettingsIcon } from 'src/design-system/icons';
import { FontSize } from 'src/features/settings/components';

export function BookFrameSettings() {
    return (
        <Dropdown
            content={(
                <List className="w-[50vw]">
                    <ListItem>
                        <FontSize />
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
