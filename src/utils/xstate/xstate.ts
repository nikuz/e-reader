import type { ErrorActorEvent } from 'xstate';

export function stateErrorTraceAction({ event }: { event: ErrorActorEvent<unknown, string> }) {
    if (import.meta.env.DEV) {
        console.trace(event.error);
    }
}