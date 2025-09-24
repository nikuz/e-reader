import type { StatusBarStateContext, StatusBarStateEvents } from '../../types';

export function toggleAction(props: {
    context: StatusBarStateContext,
    enqueue: { raise: (context: StatusBarStateEvents) => void },
}) {
    const isVisible = props.context.visible;

    if (isVisible) {
        props.enqueue.raise({ type: 'HIDE' });
    } else {
        props.enqueue.raise({ type: 'SHOW' });
    }
}