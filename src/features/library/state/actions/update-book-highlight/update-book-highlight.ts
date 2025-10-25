import type { DoneActorEvent } from 'xstate';
import type { Book } from 'src/models';
import type { LibraryStateContext } from '../../types';

export function updateBookHighlightAction(props: {
    event: DoneActorEvent<Book>,
    context: LibraryStateContext,
    enqueue: { assign: (context: Partial<LibraryStateContext>) => void },
}) {
    const updatedBook = props.event.output;
    const storedBooks = [...props.context.storedBooks];
    
    const existingBookIndex = storedBooks.findIndex(item => item.eisbn === updatedBook.eisbn);

    if (existingBookIndex !== -1) {
        storedBooks[existingBookIndex] = updatedBook;
    }

    props.enqueue.assign({ storedBooks });
}