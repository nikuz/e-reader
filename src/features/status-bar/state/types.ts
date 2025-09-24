export interface StatusBarStateContext {
    visible: boolean,
}

export interface HideEvent { type: 'HIDE' }

export interface ShowEvent { type: 'SHOW' }

export interface ToggleEvent { type: 'TOGGLE' }

export type StatusBarStateEvents =
    | HideEvent
    | ShowEvent
    | ToggleEvent;