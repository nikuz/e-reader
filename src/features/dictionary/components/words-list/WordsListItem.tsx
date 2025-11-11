import {
    ListItem,
    ListItemText,
} from 'src/design-system/components';
import { DictionaryWordPronunciationButton } from '../word-pronunciation-button';
import type { DictionaryWord } from '../../types';

interface Props {
    word: DictionaryWord,
}

export function WordsListItem(props: Props) {
    const { word } = props;

    return (
        <ListItem
            secondaryAction={<DictionaryWordPronunciationButton word={word} />}
        >
            <ListItemText
                primary={word.text}
                secondary={word.translation}
            />
        </ListItem>
    );
}
