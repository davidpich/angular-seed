'use strict';


// Declare app level module which depends on filters, and services
var myApp = angular.module('myApp', [
  'ui.router',
  'ui.utils',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers',
  'gettext',
  'angular-google-analytics',
  'ngMaterial',
  'ngMessages'
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
                  .state('main.detail', {
                    url: "/main/detail/:product",
                    templateUrl: "partials/partial3.html",
                    controller: "DetailProductCtrl"
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
    AnalyticsProvider.useAnalytics(false);
    // change page event name
    AnalyticsProvider.setPageEvent('$stateChangeSuccess');
    AnalyticsProvider.ignoreFirstPageLoad(false);

}).run(function($rootScope, gettextCatalog, Analytics) {
  $rootScope.lang = 'es';
  gettextCatalog.currentLanguage = 'en';
  gettextCatalog.debug = true;
    $rootScope.$on('$viewContentLoaded', function () {
      // $(document).foundation();
    });
  });
