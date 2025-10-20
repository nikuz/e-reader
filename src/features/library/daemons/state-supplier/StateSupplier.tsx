import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { libraryStateMachineActor } from '../../state';

export function StateSupplier() {
    const navigate = useNavigate();

    useEffect(() => {
        libraryStateMachineActor.send({
            type: 'SET_NAVIGATOR',
            navigator: navigate,
        });
    }, [navigate]);

    return null;
}
