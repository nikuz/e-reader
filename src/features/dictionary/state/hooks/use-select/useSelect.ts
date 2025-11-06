import { useSelector } from '@xstate/react';
import { dictionaryStateMachineActor } from '../../state';
import type { DictionaryStateContext } from '../../types';

type DictionaryContextKey = Exclude<keyof DictionaryStateContext, 'dbController'>;

export function useDictionaryStateSelect<K extends DictionaryContextKey>(key: K): DictionaryStateContext[K] {
    return useSelector(dictionaryStateMachineActor, (state) => state.context[key]);
}
