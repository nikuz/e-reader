import type { JSX } from 'solid-js';
import { Fab } from 'src/design-system/components';
import { AddIcon } from 'src/design-system/icons';
import { libraryStateMachineActor } from '../../state';

export function AddBookButton() {
    let fileFieldRef: HTMLInputElement | undefined;

    const selectFileHandler: JSX.EventHandler<HTMLInputElement, Event> = async (event) => {
        const file = (event.currentTarget as HTMLInputElement).files?.[0];
        if (file) {
            libraryStateMachineActor.send({
                type: 'OPEN_FILE',
                file,
            });
            if (fileFieldRef) {
                fileFieldRef.value = '';
            }
        }
    };

    return (
        <Fab color="primary" class="absolute! bottom-21 right-5">
            <label for="file-input">
                <AddIcon sx={{ fontSize: 40 }} />
            </label>
            <input
                ref={fileFieldRef}
                type="file"
                id="file-input"
                accept=".epub"
                class="hidden"
                onChange={selectFileHandler}
            />
        </Fab>
    );
}