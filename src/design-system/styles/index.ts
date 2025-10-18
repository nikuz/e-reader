import { createTheme, createPalette, ThemeProvider } from '@suid/material/styles';
// export { ThemeProvider } from '@suid/material/styles';

const darkTheme = createTheme({
    palette: createPalette({
        mode: 'dark',
    }),
});

export {
    ThemeProvider,
    darkTheme,
};