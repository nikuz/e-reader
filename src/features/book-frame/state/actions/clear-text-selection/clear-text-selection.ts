import type { BookFrameStateContext } from '../../types';

export function clearTextSelectionAction(props: {
    context: BookFrameStateContext,
    enqueue: { assign: (context: Partial<BookFrameStateContext>) => void },
}) {
    const textSelection = props.context.textSelection;

    textSelection?.removeAllRanges();

    props.enqueue.assign({
        textSelection: undefined,
        textSelectionCreateEndTime: undefined,
    });
}