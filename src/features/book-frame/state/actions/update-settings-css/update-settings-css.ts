import { getInjectedCSS } from '../../../utils';
import { INJECTED_CSS_ID } from '../../../constants';
import type { BookFrameStateContext, UpdateSettingsCSSEvent } from '../../types';

export function updateSettingsCSSAction(props: {
    event: UpdateSettingsCSSEvent,
    context: BookFrameStateContext,
    enqueue: { assign: (context: Partial<BookFrameStateContext>) => void },
}) {
    const iframeEl = props.context.iframeEl;
    const iframeDocument = iframeEl?.contentDocument;
    const injectedCSSNode = iframeDocument?.getElementById(INJECTED_CSS_ID);
    
    if (!iframeDocument || !injectedCSSNode) {
        return;
    }
    
    const injectedCSS = getInjectedCSS(props.event.settingsCSS);
    injectedCSSNode.textContent = injectedCSS;
}