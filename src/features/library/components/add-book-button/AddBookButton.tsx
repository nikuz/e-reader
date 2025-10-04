import type { JSX } from 'solid-js';
import { RiSystemAddFill } from 'solid-icons/ri';
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
        <div class="absolute bottom-21 right-5">
            <label
                for="file-input"
                class="
                    w-[50px] 
                    h-[50px] 
                    btn 
                    btn-primary 
                    rounded-full 
                    flex 
                    items-center 
                    justify-center
                "
            >
                <RiSystemAddFill size="40" />
            </label>
            <input
                ref={fileFieldRef}
                type="file"
                id="file-input"
                accept=".epub"
                class="hidden"
                onChange={selectFileHandler}
            />
        </div>
    );
}