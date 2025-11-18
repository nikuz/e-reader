import { useCallback, useEffect } from 'react';
import {
    ScreenOrientation,
    type ScreenOrientationResult,
    type OrientationLockType,
} from '@capacitor/screen-orientation';
import { screenStateMachineActor } from '../../state';

export function OrientationChangeWatcher() {
    const screenOrientationChangeHandler = useCallback((orientationResult: ScreenOrientationResult) => {
        let orientation: OrientationLockType = orientationResult.type;

        if (orientation.startsWith('landscape')) {
            orientation = 'landscape';
        } else if (orientation.startsWith('portrait')) {
            orientation = 'portrait';
        }

        screenStateMachineActor.send({
            type: 'SET_CURRENT_ORIENTATION',
            orientation,
        });
    }, []);
    
    useEffect(() => {
        ScreenOrientation.addListener('screenOrientationChange', screenOrientationChangeHandler);
        return () => {
            ScreenOrientation.removeAllListeners();
        };
    }, [screenOrientationChangeHandler]);

    return null;
}
