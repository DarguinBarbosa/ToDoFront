/**
 * Firebase web config. These values are public client identifiers (see Firebase docs);
 * security is enforced by Remote Config rules and App Check, not secrecy.
 * Leave apiKey blank to run fully offline — FeatureFlagService falls back to safe defaults.
 */
export const environment = {
  production: false,
  firebase: {
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '1:',
  },
};
