import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.nikuz.ereader',
    appName: 'e-reader',
    webDir: 'dist',
    server: {
        url: "http://192.168.1.70:3000",
        cleartext: true,
    },
    plugins: {
        CapacitorSQLite: {
            iosDatabaseLocation: 'Library/CapacitorDatabase',
            iosIsEncryption: false,
            androidIsEncryption: false,
        }
    }
};

export default config;
