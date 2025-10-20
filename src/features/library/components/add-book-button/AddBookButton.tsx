import { useRef } from 'react';
import { Fab } from 'src/design-system/components';
import { AddIcon } from 'src/design-system/icons';
import { libraryStateMachineActor } from '../../state';

export function AddBookButton() {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const selectFileHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.currentTarget.files?.[0];
        if (!file) {
            return;
        }

        libraryStateMachineActor.send({
            type: 'OPEN_FILE',
            file,
        });

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <Fab component="label" color="primary" className="!absolute bottom-5 right-5">
            <AddIcon sx={{ fontSize: 40 }} />
            <input
                ref={fileInputRef}
                type="file"
                accept=".epub"
                hidden
                onChange={selectFileHandler}
            />
        </Fab>
    );
}
