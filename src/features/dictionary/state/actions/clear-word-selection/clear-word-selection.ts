import type { DictionaryStateContext } from '../../types';

export function clearWordSelectionAction(props: {
    context: DictionaryStateContext,
    enqueue: { assign: (context: Partial<DictionaryStateContext>) => void },
}) {
    props.enqueue.assign({
        translatingWord: undefined,
    });
}