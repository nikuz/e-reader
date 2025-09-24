import { StatusBar, Style } from '@capacitor/status-bar';
import type { StatusBarStateContext } from '../../types';

export function hideAction(props: {
    context: StatusBarStateContext,
    enqueue: { assign: (context: Partial<StatusBarStateContext>) => void },
}) {
    StatusBar.setStyle({ style: Style.Light });

    props.enqueue.assign({
        visible: false,
    });
}