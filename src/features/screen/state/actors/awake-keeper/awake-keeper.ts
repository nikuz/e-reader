import { Capacitor } from '@capacitor/core';
import { KeepAwake } from '@capacitor-community/keep-awake';
import { fromPromise } from 'xstate';

export const awakeKeeperActor = fromPromise(async (): Promise<void> => {
    if (!Capacitor.isNativePlatform()) {
        return;
    }
    
    await KeepAwake.keepAwake();
});
