import { useSelector } from '@xstate/react';
import type { StateValueFrom } from 'xstate';
import { debugStateMachine, debugStateMachineActor } from '../../state';

export function useDebugStateMatch(values: StateValueFrom<typeof debugStateMachine>[]): boolean {
    return useSelector(debugStateMachineActor, (state) =>
        values.some((value) => state.matches(value)),
    );
}
