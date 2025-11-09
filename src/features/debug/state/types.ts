export interface DebugStateContext {
    enabled: boolean,
}

export interface ShowEvent { type: 'SHOW' }

export interface HideEvent { type: 'HIDE' }

export interface DisableEvent { type: 'DISABLE' }

export type DebugStateEvents =
    | ShowEvent
    | HideEvent
    | DisableEvent;
