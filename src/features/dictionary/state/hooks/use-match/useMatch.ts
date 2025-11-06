import { useSelector } from '@xstate/react';
import type { StateValueFrom } from 'xstate';
import { dictionaryStateMachine, dictionaryStateMachineActor } from '../../state';

export function useDictionaryStateMatch(values: StateValueFrom<typeof dictionaryStateMachine>[]): boolean {
    return useSelector(dictionaryStateMachineActor, (state) =>
        values.some((value) => state.matches(value)),
    );
}
