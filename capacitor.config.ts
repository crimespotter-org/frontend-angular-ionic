import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.crimespotter.app',
  appName: 'crimespotter',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
