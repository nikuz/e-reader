import { createEffect } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { libraryStateMachineActor } from '../../state';

export function StateSupplier() {
    const navigate = useNavigate();

    createEffect(() => {
        libraryStateMachineActor.send({
            type: 'SET_NAVIGATOR',
            navigator: navigate,
        });
    });

    return null;
}