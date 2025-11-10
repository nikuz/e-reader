import type {
    QueueManagerImageRequestSuccessEvent,
    QueueManagerContextAnalysisRequestSuccessEvent
} from '../../../queue-manager/types';
import type { DictionaryStateContext } from '../../types';

export function updateSelectedWordAction(props: {
    event: QueueManagerImageRequestSuccessEvent | QueueManagerContextAnalysisRequestSuccessEvent,
    context: DictionaryStateContext,
    enqueue: { assign: (context: Partial<DictionaryStateContext>) => void },
}) {
    const eventWord = props.event.word;

    if (!props.context.selectedWord || props.context.selectedWord.id !== eventWord.id) {
        return;
    }
    
    props.enqueue.assign({
        selectedWord: eventWord,
    });
}