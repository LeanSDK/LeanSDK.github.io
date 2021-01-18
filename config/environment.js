'use strict';

module.exports = function (environment) {
  let ENV = {
    modulePrefix: '@leansdk/leanes-documentation',
    environment,
    rootURL: '/',
    locationType: 'trailing-history',

    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false,
      },
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    guidemaker: {
      title: 'Guidemaker Docs',
      description: 'Guides - Built with Guidemaker',
      sourceRepo: 'https://github.com/LeanSDK/LeanSDK.github.io',
      logo: '/images/logo.svg',
      // this will be used for the copyright line in the bottom left of the page - if not provided then
      // it will use `title` instead
      copyright: 'My Awesome Company',
      // show social links
      social: {
        // provide the slug for the github link (can be a project or an org)
        github: 'LeanSDK/leanes',
        // provide your username
        twitter: 'real_ate',
        // provide your invite link for your public discord
        discordLink: '<insert link here>'
      },

    },

    historySupportMiddleware: true
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
  }

  return ENV;
};
