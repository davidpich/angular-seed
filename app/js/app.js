'use strict';


// Declare app level module which depends on filters, and services
var myApp = angular.module('myApp', [
  'ui.router',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers',
  'ui.utils',
  'gettext',
  'underscore',
  'ngFlag',
  'ngProgress',
  'angular-google-analytics'
]).
config(function($stateProvider, $urlRouterProvider, AnalyticsProvider) {
        //
        // For any unmatched url, redirect to /state1
        $urlRouterProvider.otherwise("/main");
        //
        // Now set up the states

        $stateProvider
                .state('main', {
                    url: "/main",
                    templateUrl: "partials/partial1.html",
                    controller: "AppCtrl"
                })
                .state('grid', {
                    url: "/grid",
                    templateUrl: "partials/partial2.html",
                    controller: "GridCtrl"
                });
         // initial configuration Google Analytics
    AnalyticsProvider.setAccount('UA-837977-23');

    // track all routes (or not)
    AnalyticsProvider.trackPages(true);

    // Use analytics.js instead of ga.js
    AnalyticsProvider.useAnalytics(true);

    // Ignore first page view... helpful when using hashes and whenever your bounce rate looks obscenely low.
    AnalyticsProvider.ignoreFirstPageLoad(false);

    //Enabled eCommerce module for analytics.js
    AnalyticsProvider.useECommerce(false);

    //Enable enhanced link attribution
    AnalyticsProvider.useEnhancedLinkAttribution(true);

    // change page event name
    AnalyticsProvider.setPageEvent('$stateChangeSuccess');
}).run(function($rootScope, gettextCatalog, Analytics) {
  $rootScope.lang = 'es';
  gettextCatalog.currentLanguage = 'en';
  gettextCatalog.debug = true;
    $rootScope.$on('$viewContentLoaded', function () {
      $(document).foundation();
    });
  });

