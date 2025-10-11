import type { SettingsGroup } from '../../defaults';

export function generateSettingsCSS(settings: SettingsGroup[]): string {
    const css: string[] = [];

    for (const group of settings) {
        css.push(group.toCss());
    }

    return css.join('');
}