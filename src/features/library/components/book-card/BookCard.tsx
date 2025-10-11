import { Show, createSignal, type JSX } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { AiOutlineMore } from 'solid-icons/ai';
import { bookFrameStateMachineActor } from 'src/features/book-frame/state';
import { libraryStateMachineActor } from 'src/features/library/state';
import { Routes } from 'src/router/constants';
import type { BookAttributes } from '../../types';

interface Props {
    bookAttributes: BookAttributes,
}

export function BookCard(props: Props) {
    const [isMenuOpen, setIsMenuOpen] = createSignal(false);
    const navigate = useNavigate();

    const selectHandler = () => {
        bookFrameStateMachineActor.send({
            type: 'LOAD_BOOK',
            bookAttributes: props.bookAttributes,
        });
        navigate(Routes.BOOK);
    };

    const closeMenu = () => setIsMenuOpen(false);

    const cardClickHandler: JSX.EventHandler<HTMLDivElement, MouseEvent> = () => {
        closeMenu();
        selectHandler();
    };

    const toggleMenu: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (event) => {
        event.stopPropagation();
        setIsMenuOpen((current) => !current);
    };

    const handleMenuFocusOut: JSX.EventHandler<HTMLDivElement, FocusEvent> = (event) => {
        const relatedTarget = event.relatedTarget as Node | null;
        if (!event.currentTarget.contains(relatedTarget)) {
            closeMenu();
        }
    };

    const removeHandler: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (event) => {
        event.stopPropagation();
        closeMenu();

        const shouldRemove = window.confirm(`Remove "${props.bookAttributes.title}" from your library?`);
        if (!shouldRemove) {
            return;
        }

        libraryStateMachineActor.send({
            type: 'REMOVE_BOOK',
            bookAttributes: props.bookAttributes,
        });
    };

    return (
        <div class="min-h-80 cursor-pointer rounded-b-lg">
            <Show when={props.bookAttributes.cover}>
                <div
                    class="relative aspect-[2/3] overflow-hidden rounded shadow"
                    onClick={cardClickHandler}
                >
                    <img
                        src={props.bookAttributes.cover}
                        class="size-full object-cover active:opacity-50"
                        alt={props.bookAttributes.title}
                    />
                </div>
            </Show>
            <div class="mt-1 flex items-center gap-2 px-1">
                <p
                    class="flex-1 text-sm"
                    onClick={cardClickHandler}
                >
                    {props.bookAttributes.title}
                </p>
                <div
                    class={`dropdown dropdown-end ${isMenuOpen() ? 'dropdown-open' : ''}`}
                    onFocusOut={handleMenuFocusOut}
                >
                    <button
                        class="btn btn-ghost btn-circle btn-xs"
                        onClick={toggleMenu}
                    >
                        <AiOutlineMore size={20} />
                    </button>
                    <ul class="dropdown-content menu menu-sm bg-base-100 rounded-box shadow p-0">
                        <li>
                            <button
                                class="text-error"
                                onClick={removeHandler}
                            >
                                Delete
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
