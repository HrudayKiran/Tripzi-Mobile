import { AdMobBanner, AdMobInterstitial, AdMobRewarded, setTestDeviceIDAsync } from 'expo-ads-admob';

// For production, replace with your actual Ad Unit IDs
const BANNER_AD_UNIT_ID = 'ca-app-pub-3940256099942544/6300978111'; // Test ID
const INTERSTITIAL_AD_UNIT_ID = 'ca-app-pub-3940256099942544/1033173712'; // Test ID

export const initAds = async () => {
  await setTestDeviceIDAsync('EMULATOR');
};

export const showInterstitial = async () => {
  try {
    await AdMobInterstitial.setAdUnitID(INTERSTITIAL_AD_UNIT_ID);
    await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true });
    await AdMobInterstitial.showAdAsync();
  } catch (error) {
    console.error('Error showing interstitial ad:', error);
  }
};

export { BANNER_AD_UNIT_ID };
