import type { SettingsStateContext } from '../../types';

export function generateSettingsCSSAction(props: {
    context: SettingsStateContext,
    enqueue: { assign: (context: Partial<SettingsStateContext>) => void },
}) {
    const fontSettings = props.context.font;
    const css: string[] = [];

    css.push(fontSettings.toCss());

    props.enqueue.assign({
        settingsCSS: css.join(''),
    });
}