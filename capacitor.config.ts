import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.nikuz.ereader',
    appName: 'e-reader',
    webDir: 'dist',
    plugins: {
        CapacitorSQLite: {
            iosDatabaseLocation: 'Library/CapacitorDatabase',
            iosIsEncryption: false,
            androidIsEncryption: false,
        }
    },
    // server: {
    //     url: "http://192.168.1.70:3000",
    //     cleartext: true,
    // },
};

export default config;
