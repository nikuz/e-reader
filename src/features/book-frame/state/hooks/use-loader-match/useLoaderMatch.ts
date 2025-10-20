import { useSelector } from '@xstate/react';
import type { StateValueFrom } from 'xstate';
import { bookLoaderStateMachine } from '../../../loader/state';
import { bookFrameStateMachineActor } from '../../state';

export function useBookLoaderStateMatch(values: StateValueFrom<typeof bookLoaderStateMachine>[]): boolean {
    const loaderActor = useSelector(bookFrameStateMachineActor, (state) => state.context.loaderMachineRef);
    return useSelector(loaderActor, (state) => {
        return values.some((value) => state?.matches(value));
    });
}
