import { Capacitor } from '@capacitor/core';
import { StatusBar, Style, Animation } from '@capacitor/status-bar';
import { fromPromise } from 'xstate';

export const initializerActor = fromPromise(async (): Promise<void> => {
    if (!Capacitor.isNativePlatform()) {
        return;
    }
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: '#000000' });
    await StatusBar.show({ animation: Animation.None });
});
