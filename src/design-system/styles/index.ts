import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
export type { SxProps } from '@mui/material/styles';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

export {
    ThemeProvider,
    darkTheme,
    styled,
};
