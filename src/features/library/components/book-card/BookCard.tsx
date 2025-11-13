import { useState } from 'react';
import {
    Box,
    IconButton,
    Dropdown,
    List,
    ListItemButton,
    Card,
    CardContent,
    Typography,
    Dialog,
    DialogTitle,
    DialogActions,
    Button,
} from 'src/design-system/components';
import { MoreVertIcon } from 'src/design-system/icons';
import type { BookModel } from 'src/models';
import { libraryStateMachineActor } from '../../state';
import { BookCover } from '../book-cover';

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
        <Card className="min-h-80 cursor-pointer rounded-b-lg grid grid-rows-[auto_70px]">
            {book.cover && (
                <Box className="flex-1" onClick={cardClickHandler}>
                    <BookCover book={book} />
                </Box>
            )}
            <CardContent className="mt-1 flex items-start gap-2 p-0!">
                <Box className="flex-1 py-2 pl-2">
                    <Typography
                        className="text-sm line-clamp-2 text-ellipsis"
                        onClick={cardClickHandler}
                    >
                        {book.title}
                    </Typography>
                </Box>
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
