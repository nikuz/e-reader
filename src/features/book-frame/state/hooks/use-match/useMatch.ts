import { useSelector } from '@xstate/react';
import type { StateValueFrom } from 'xstate';
import { bookFrameStateMachine, bookFrameStateMachineActor } from '../../state';

export function useBookFrameStateMatch(values: StateValueFrom<typeof bookFrameStateMachine>[]): boolean {
    return useSelector(bookFrameStateMachineActor, (state) =>
        values.some((value) => state.matches(value)),
    );
}
