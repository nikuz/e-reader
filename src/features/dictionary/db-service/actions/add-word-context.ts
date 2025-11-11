import { DatabaseController } from 'src/controllers';
import { DICTIONARY_DB_CONFIG } from '../../constants';
import type {
    DictionaryWord,
    DictionaryWordContext,
    DictionaryWordContextExplanation,
} from '../../types';

export async function addWordContextInDB(props: {
    db: DatabaseController,
    word: DictionaryWord,
    newContext: DictionaryWordContext,
    contextExplanation: DictionaryWordContextExplanation,
}): Promise<void> {
    const {
        db,
        word,
        newContext,
        contextExplanation,
    } = props;
    const wordContexts = [...word.contexts];

    if (!wordContexts.find(item => item.id === newContext.id)) {
        wordContexts.push(newContext);
    }

    await db.execute(
        `
            UPDATE "${DICTIONARY_DB_CONFIG.name}"
            SET contexts=:contexts, contextExplanations=:explanations, updatedAt=datetime("now")
            WHERE id=:id;
        `,
        [
            JSON.stringify(wordContexts),
            JSON.stringify([
                ...word.contextExplanations,
                contextExplanation,
            ]),
            word.id
        ]
    );
}