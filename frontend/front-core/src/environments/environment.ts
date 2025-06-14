// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',
  publicS3Url: 'http://localhost:8080/local',
  stripe_token: 'pk_test_51QanH2GXALs4BEz3qDKaIyLzQDgDDqJIpxWhHhPoFBMG9CsdljEfluqQoOER34vuSSUvWsh7xPA8k4krITuoZ7d100ZtlCQxTx',
  paypal_token: 'PAYPAL_TOKEN'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
