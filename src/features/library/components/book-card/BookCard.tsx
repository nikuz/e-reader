import { Show } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { bookFrameStateMachineActor } from 'src/features/book-frame/state';
import { Routes } from 'src/types';
import type { BookAttributes } from 'src/types';

interface Props {
    bookAttributes: BookAttributes,
}

export function BookCard(props: Props) {
    const navigate = useNavigate();

    const selectHandler = () => {
        bookFrameStateMachineActor.send({
            type: 'LOAD_BOOK',
            bookAttributes: props.bookAttributes,
        });
        navigate(Routes.BOOK);
    };

    return (
        <div class="relative min-h-80">
            <Show when={props.bookAttributes.cover}>
                <div class="aspect-[2/3] overflow-hidden rounded shadow">
                    <img
                        src={props.bookAttributes.cover}
                        class="size-full object-cover"
                        alt="cover"
                    />
                </div>
            </Show>
            <p class="text-center mt-1">
                {props.bookAttributes.title}
            </p>
            <div
                class="absolute left-0 top-0 right-0 bottom-0 rounded-b-lg active:bg-slate-950/10"
                onClick={selectHandler}
            />
        </div>
    );
}