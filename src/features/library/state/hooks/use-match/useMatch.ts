import { useSelector } from '@xstate/react';
import type { StateValueFrom } from 'xstate';
import { libraryStateMachine, libraryStateMachineActor } from '../../state';

export function useLibraryStateMatch(values: StateValueFrom<typeof libraryStateMachine>[]): boolean {
    return useSelector(libraryStateMachineActor, (state) =>
        values.some((value) => state.matches(value)),
    );
}
