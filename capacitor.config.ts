import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.crimespotter.crimespotter',
  appName: 'crimespotter',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    BackgroundRunner: {
      label: 'com.crimespotter.crimespotter.check',
      src: 'runners/runner.js',
      event: 'myCustomEvent',
      repeat: true,
      interval: 5,
      autoStart: true
    }
  }
};

export default config;
