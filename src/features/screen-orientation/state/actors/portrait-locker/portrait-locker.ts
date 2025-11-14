import { Capacitor } from '@capacitor/core';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { fromPromise } from 'xstate';

export const portraitLockerActor = fromPromise(async (): Promise<void> => {
    if (!Capacitor.isNativePlatform()) {
        return;
    }
    
    await ScreenOrientation.lock({ orientation: 'portrait' });
});
