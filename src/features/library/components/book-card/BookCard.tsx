import { useState } from 'react';
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
import type { BookModel } from 'src/models';

interface Props {
    book: BookModel,
}

export function BookCard({ book }: Props) {
    const [isPromptOpen, setIsPromptOpen] = useState(false);

    const selectHandler = () => {
        libraryStateMachineActor.send({
            type: 'SELECT_BOOK',
            book,
        });
    };

    const cardClickHandler = () => {
        selectHandler();
    };

    const closePromptHandler = () => {
        setIsPromptOpen(false);
    };

    const removeHandler = () => {
        closePromptHandler();
        libraryStateMachineActor.send({
            type: 'REMOVE_BOOK',
            book,
        });
    };

    return <>
        <Card className="min-h-80 cursor-pointer rounded-b-lg">
            {book.cover && (
                <CardMedia
                    component="img"
                    image={book.cover}
                    alt={book.title}
                    onClick={cardClickHandler}
                />
            )}
            <CardContent className="mt-1 flex items-start gap-2 p-0!">
                <Typography
                    className="flex-1 text-sm py-2! pl-2!"
                    onClick={cardClickHandler}
                >
                    {book.title}
                </Typography>
                <Dropdown
                    content={(closeDropdown) => (
                        <List disablePadding>
                            <ListItemButton onClick={() => {
                                setIsPromptOpen(true);
                                closeDropdown();
                            }}>
                                Delete
                            </ListItemButton>
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
                    <IconButton>
                        <MoreVertIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                </Dropdown>
            </CardContent>
        </Card>

        <Dialog
            open={isPromptOpen}
            onClose={closePromptHandler}
        >
            <DialogTitle>
                {`Remove "${book.title}" from your library?`}
            </DialogTitle>
            <DialogActions>
                <Button onClick={closePromptHandler}>Cancel</Button>
                <Button onClick={removeHandler}>Yes</Button>
            </DialogActions>
        </Dialog>
    </>;
}
