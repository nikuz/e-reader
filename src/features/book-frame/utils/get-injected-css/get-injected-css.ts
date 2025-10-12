import baseInjectedCss from '../../injections/style/main.css?raw';
import {
    INJECTED_CSS_START_COMMENT,
    INJECTED_CSS_END_COMMENT,
} from '../../constants';

export function getInjectedCSS(settingsCSS: string): string {
    return `
        ${INJECTED_CSS_START_COMMENT}
        ${baseInjectedCss}
        ${settingsCSS}
        ${INJECTED_CSS_END_COMMENT}
    `;
}