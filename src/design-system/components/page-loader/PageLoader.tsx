import CircularProgress, { type CircularProgressProps } from '@suid/material/CircularProgress';
import Box from '@suid/material/Box';

export function PageLoader(props: CircularProgressProps) {
    return (
        <Box class="absolute left-0 top-0 right-0 bottom-0 flex items-center justify-center z-[999]">
            <CircularProgress {...props} />
        </Box>
    );
}