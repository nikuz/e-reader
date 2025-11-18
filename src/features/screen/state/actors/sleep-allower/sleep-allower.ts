import { Capacitor } from '@capacitor/core';
import { KeepAwake } from '@capacitor-community/keep-awake';
import { fromPromise } from 'xstate';

export const sleepAllowerActor = fromPromise(async (): Promise<void> => {
    if (!Capacitor.isNativePlatform()) {
        return;
    }
    
    await KeepAwake.allowSleep();
});
