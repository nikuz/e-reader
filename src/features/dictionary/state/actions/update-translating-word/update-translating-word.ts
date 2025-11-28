import type {
    QueueManagerWordAnalysisTranslationRetrievedEvent,
    QueueManagerWordAnalysisExplanationRetrievedEvent,
    QueueManagerWordAnalysisPronunciationRetrievedEvent,
    QueueManagerWordAnalysisUpdateEvent,
    QueueManagerWordAnalysisRequestSuccessEvent,
    QueueManagerImageRequestSuccessEvent,
    QueueManagerPronunciationRequestSuccessEvent,
    QueueManagerContextAnalysisExplanationRequestSuccessEvent,
    QueueManagerContextAnalysisRequestSuccessEvent,
} from '../../../queue-manager/types';
import type { DictionaryStateContext } from '../../types';

type InputEvent =
    | QueueManagerWordAnalysisTranslationRetrievedEvent
    | QueueManagerWordAnalysisExplanationRetrievedEvent
    | QueueManagerWordAnalysisPronunciationRetrievedEvent
    | QueueManagerWordAnalysisUpdateEvent
    | QueueManagerWordAnalysisRequestSuccessEvent
    | QueueManagerImageRequestSuccessEvent
    | QueueManagerPronunciationRequestSuccessEvent
    | QueueManagerContextAnalysisExplanationRequestSuccessEvent
    | QueueManagerContextAnalysisRequestSuccessEvent;

export function updateTranslatingWordAction(props: {
    event: InputEvent,
    context: DictionaryStateContext,
    enqueue: { assign: (context: Partial<DictionaryStateContext>) => void },
}) {
    const currentTranslatingHighlight = props.context.translatingHighlight;
    const highlight = props.event.highlight;

    if (!props.context.translatingWord || currentTranslatingHighlight?.id !== highlight.id) {
        return;
    }

    let currentTranslatingWord = { ...props.context.translatingWord };

    switch (props.event.type) {
        case 'QUEUE_MANAGER_WORD_ANALYSIS_TRANSLATION_RETRIEVED':
            currentTranslatingWord.translation = props.event.translation;
            break;

        case 'QUEUE_MANAGER_WORD_ANALYSIS_EXPLANATION_RETRIEVED':
            currentTranslatingWord.explanation = props.event.explanation;
            break;

        case 'QUEUE_MANAGER_WORD_ANALYSIS_PRONUNCIATION_RETRIEVED':
            currentTranslatingWord.pronunciation = props.event.pronunciation;
            break;

        case 'QUEUE_MANAGER_WORD_ANALYSIS_UPDATE':
            console.log('update:', props.event);
            currentTranslatingWord.translation = props.event.translation;
            currentTranslatingWord.explanation = props.event.explanation;
            currentTranslatingWord.pronunciation = props.event.pronunciation;
            break;

        case 'QUEUE_MANAGER_WORD_ANALYSIS_REQUEST_SUCCESS':
        case 'QUEUE_MANAGER_IMAGE_REQUEST_SUCCESS':
        case 'QUEUE_MANAGER_PRONUNCIATION_REQUEST_SUCCESS':
        case 'QUEUE_MANAGER_CONTEXT_ANALYSIS_EXPLANATION_REQUEST_SUCCESS':
        case 'QUEUE_MANAGER_CONTEXT_ANALYSIS_REQUEST_SUCCESS':
            currentTranslatingWord = props.event.word;
            break;
    }

    props.enqueue.assign({
        translatingWord: currentTranslatingWord,
    });
}