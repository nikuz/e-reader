import baseInjectedCss from 'src/static-injections/style/main.css?raw';

export function getInjectedCSS(settingsCSS: string): string {
    return `
        ${baseInjectedCss}
        ${settingsCSS}
    `;
}