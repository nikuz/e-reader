import { db } from 'src/controllers';
import type {
    DictionaryWord,
    DictionaryWordContext,
    DictionaryWordContextExplanation,
} from '../types';

export async function addWordContextInDB(props: {
    word: DictionaryWord,
    newContext: DictionaryWordContext,
    contextExplanation: DictionaryWordContextExplanation,
}): Promise<void> {
    const {
        word,
        newContext,
        contextExplanation,
    } = props;
    const wordContexts = [...word.contexts];

    if (!wordContexts.find(item => item.id === newContext.id)) {
        wordContexts.push(newContext);
    }

    await db.run(
        `
            UPDATE "dictionary-words"
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