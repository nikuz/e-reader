import Box from '@mui/material/Box';
import CircularProgress, { type CircularProgressProps } from '@mui/material/CircularProgress';

export function PageLoader(props: CircularProgressProps) {
    return (
        <Box className="absolute left-0 top-0 right-0 bottom-0 flex items-center justify-center z-999">
            <CircularProgress {...props} />
        </Box>
    );
}
