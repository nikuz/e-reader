import type {
    QueueManagerWordAnalysisTranslationRetrievedEvent,
    QueueManagerWordAnalysisExplanationRetrievedEvent,
    QueueManagerWordAnalysisPronunciationRetrievedEvent,
} from '../../../queue-manager/types';
import type { DictionaryStateContext } from '../../types';

type InputEvent = 
    | QueueManagerWordAnalysisTranslationRetrievedEvent
    | QueueManagerWordAnalysisExplanationRetrievedEvent
    | QueueManagerWordAnalysisPronunciationRetrievedEvent;

export function updateTranslatingWordAction(props: {
    event: InputEvent,
    context: DictionaryStateContext,
    enqueue: { assign: (context: Partial<DictionaryStateContext>) => void },
}) {
    const eventWord = props.event.word;

    if (!props.context.translatingWord || props.context.translatingWord.id !== eventWord.id) {
        return;
    }
    
    const currentTranslatingWord = { ...props.context.translatingWord };

    switch (props.event.type) {
        case 'QUEUE_MANAGER_WORD_ANALYSIS_TRANSLATION_RETRIEVED':
            currentTranslatingWord.translation = props.event.translation;
            break;
        
        case 'QUEUE_MANAGER_WORD_ANALYSIS_EXPLANATION_RETRIEVED': 
            currentTranslatingWord.explanations = [
                ...currentTranslatingWord.explanations,
                {
                    contextId: currentTranslatingWord.contexts[0].id,
                    text: props.event.explanation,
                }
            ];
            break;
        
        case 'QUEUE_MANAGER_WORD_ANALYSIS_PRONUNCIATION_RETRIEVED':
            currentTranslatingWord.pronunciation = props.event.pronunciation;
            break;
    }

    props.enqueue.assign({
        translatingWord: currentTranslatingWord,
    });
}