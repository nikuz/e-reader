import type { OrientationLockType } from '@capacitor/screen-orientation';

export interface ScreenStateContext {
    orientation: OrientationLockType,
}

export interface LockPortraitEvent { type: 'LOCK_PORTRAIT' }

export interface LockLandscapeEvent { type: 'LOCK_LANDSCAPE' }

export interface UnlockEvent { type: 'UNLOCK' }

export interface SetCurrentOrientationEvent {
    type: 'SET_CURRENT_ORIENTATION',
    orientation: OrientationLockType,
}

export type ScreenStateEvents =
    | LockPortraitEvent
    | LockLandscapeEvent
    | UnlockEvent
    | SetCurrentOrientationEvent;