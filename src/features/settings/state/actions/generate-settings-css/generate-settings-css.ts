import type { SettingsStateContext } from '../../types';

export function generateSettingsCSSAction(props: {
    context: SettingsStateContext,
    enqueue: { assign: (context: Partial<SettingsStateContext>) => void },
}) {
    const fontSettings = props.context.font;
    const layoutSettings = props.context.layout;
    const css: string[] = [];

    css.push(fontSettings.toCss());
    css.push(layoutSettings.toCss());

    props.enqueue.assign({
        settingsCSS: css.join(''),
        fontCSS: fontSettings.getFontCss(),
    });
}