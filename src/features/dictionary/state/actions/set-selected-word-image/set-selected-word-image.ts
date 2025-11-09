import type { QueueManagerImageRequestSuccessEvent } from '../../../queue-manager/types';
import type { DictionaryStateContext } from '../../types';

export function setSelectedWordImageAction(props: {
    event: QueueManagerImageRequestSuccessEvent,
    context: DictionaryStateContext,
    enqueue: { assign: (context: Partial<DictionaryStateContext>) => void },
}) {
    const eventWord = props.event.word;

    if (!props.context.selectedWord || props.context.selectedWord.id !== eventWord.id) {
        return;
    }
    
    const selectedWord = {
        ...props.context.selectedWord,
        image: props.event.image,
    };

    props.enqueue.assign({ selectedWord });
}