import type {
    QueueManagerImageRequestSuccessEvent,
    QueueManagerPronunciationRequestSuccessEvent,
    QueueManagerContextAnalysisExplanationRequestSuccessEvent,
    QueueManagerContextAnalysisRequestSuccessEvent,
} from '../../../queue-manager/types';
import type { DictionaryStateContext } from '../../types';

type InputEvent =
    | QueueManagerImageRequestSuccessEvent
    | QueueManagerPronunciationRequestSuccessEvent
    | QueueManagerContextAnalysisExplanationRequestSuccessEvent
    | QueueManagerContextAnalysisRequestSuccessEvent;

export function updateSelectedWordAction(props: {
    event: InputEvent,
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