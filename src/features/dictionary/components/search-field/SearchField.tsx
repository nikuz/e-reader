import { useState, useCallback } from 'react';
import { Box, OutlinedInput, IconButton } from 'src/design-system/components';
import { SearchIcon, CloseIcon } from 'src/design-system/icons';
import { dictionaryStateMachineActor } from '../../state';

export function SearchField() {
    const [searchValue, setSearchValue] = useState('');

    const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchValue(value);

        if (value.trim()) {
            dictionaryStateMachineActor.send({
                type: 'SEARCH_WORD',
                searchText: value,
            });
        } else {
            dictionaryStateMachineActor.send({
                type: 'CLEAR_SEARCH_RESULTS',
            });
        }
    }, []);

    const handleClearClick = useCallback(() => {
        setSearchValue('');
        dictionaryStateMachineActor.send({
            type: 'CLEAR_SEARCH_RESULTS',
        });
    }, []);

    return (
        <Box sx={{ padding: 2 }}>
            <OutlinedInput
                fullWidth
                value={searchValue}
                onChange={handleSearchChange}
                placeholder="Search for new words"
                startAdornment={<SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />}
                endAdornment={
                    searchValue && (
                        <IconButton
                            size="small"
                            onClick={handleClearClick}
                            edge="end"
                            aria-label="clear search"
                        >
                            <CloseIcon />
                        </IconButton>
                    )
                }
                sx={{
                    backgroundColor: 'background.paper',
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'divider',
                    },
                }}
            />
        </Box>
    );
}
