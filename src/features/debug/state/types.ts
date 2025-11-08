export interface DebugStateContext {
    enabled: boolean,
}

export interface ShowEvent { type: 'SHOW' }

export interface HideEvent { type: 'HIDE' }

export type DebugStateEvents =
    | ShowEvent
    | HideEvent;
