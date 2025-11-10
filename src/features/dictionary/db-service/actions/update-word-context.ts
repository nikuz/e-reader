import { DatabaseController } from 'src/controllers';
import { DICTIONARY_DB_CONFIG } from '../../constants';
import type {
    DictionaryWord,
    DictionaryWordContext,
    DictionaryWordContextExplanation,
    DictionaryWordContextImage,
} from '../../types';

export async function updateWordContextInDB(props: {
    db: DatabaseController,
    word: DictionaryWord,
    newContext: DictionaryWordContext,
    contextExplanation: DictionaryWordContextExplanation,
    contextImage: DictionaryWordContextImage,
}): Promise<void> {
    const {
        db,
        word,
        newContext,
        contextExplanation,
        contextImage,
    } = props;
    const wordContextExplanations = [
        ...word.contextExplanations,
        contextExplanation,
    ];
    const wordContextImages = [
        ...word.contextImages,
        contextImage,
    ];
    const wordContexts = [...word.contexts];

    if (!wordContexts.find(item => item.id === newContext.id)) {
        wordContexts.push(newContext);
    }

    await db.execute(
        `
            UPDATE "${DICTIONARY_DB_CONFIG.name}"
            SET contexts=:contexts, contextExplanations=:explanations, contextImages=:images, updatedAt=datetime("now")
            WHERE id=:id;
        `,
        [
            JSON.stringify(wordContexts),
            JSON.stringify(wordContextExplanations),
            JSON.stringify(wordContextImages),
            word.id
        ]
    );
}