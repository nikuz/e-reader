import { StatusBar, Style } from '@capacitor/status-bar';
import type { StatusBarStateContext } from '../../types';

export function showAction(props: {
    context: StatusBarStateContext,
    enqueue: { assign: (context: Partial<StatusBarStateContext>) => void },
}) {
    StatusBar.setStyle({ style: Style.Dark });
    
    props.enqueue.assign({
        visible: true,
    });
}