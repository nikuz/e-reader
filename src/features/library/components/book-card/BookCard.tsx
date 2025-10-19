import { createSignal, Show, type JSX } from 'solid-js';
import {
    IconButton,
    Dropdown,
    List,
    ListItemButton,
    Card,
    CardMedia,
    CardContent,
    Typography,
    Dialog,
    DialogTitle,
    DialogActions,
    Button,
} from 'src/design-system/components';
import { MoreVertIcon } from 'src/design-system/icons';
import { libraryStateMachineActor } from '../../state';
import type { BookAttributes } from '../../types';

interface Props {
    bookAttributes: BookAttributes,
}

export function BookCard(props: Props) {
    const [isPromptOpen, setIsPromptOpen] = createSignal(false);

    const selectHandler = () => {
        libraryStateMachineActor.send({
            type: 'SELECT_BOOK',
            bookAttributes: props.bookAttributes,
        });
    };

    const cardClickHandler: JSX.EventHandler<HTMLElement, MouseEvent> = () => {
        selectHandler();
    };

    const closePromptHandler = () => {
        setIsPromptOpen(false);
    };

    const removeHandler = () => {
        closePromptHandler();
        libraryStateMachineActor.send({
            type: 'REMOVE_BOOK',
            bookAttributes: props.bookAttributes,
        });
    };

    return <>
        <Card class="min-h-80 cursor-pointer rounded-b-lg">
            <Show when={props.bookAttributes.cover}>
                <CardMedia
                    component='img'
                    image={props.bookAttributes.cover}
                    alt={props.bookAttributes.title}
                    onClick={cardClickHandler}
                />
            </Show>
            <CardContent class="mt-1 flex items-flex-start gap-2 p-0!">
                <Typography
                    class="flex-1 text-sm py-2! pl-2!"
                    onClick={cardClickHandler}
                >
                    {props.bookAttributes.title}
                </Typography>
                <Dropdown
                    content={(closeDropdown) => {
                        return (
                            <List disablePadding>
                                <ListItemButton onClick={() => {
                                    setIsPromptOpen(true);
                                    closeDropdown();
                                }}>
                                    Delete
                                </ListItemButton>
                            </List>
                        );
                    }}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                >
                    <IconButton>
                        <MoreVertIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                </Dropdown>
            </CardContent>
        </Card>

        <Dialog
            open={isPromptOpen()}
            onClose={closePromptHandler}
        >
            <DialogTitle>
                {`Remove "${props.bookAttributes.title}" from your library?`}
            </DialogTitle>
            <DialogActions>
                <Button onClick={closePromptHandler}>Cancel</Button>
                <Button onClick={removeHandler}>Yes</Button>
            </DialogActions>
        </Dialog>
    </>;
}
