/**
 * Refurbishy web app
 * v0.0.1
 *
 * Copyright (c)2014 David Pich
 * Distributed under BSD-2-Clause license
 *
 * http://davidpich.com
 */

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


'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
 .controller('AppCtrl', function($rootScope, APIservice, state, ngProgress, Analytics) {
        $rootScope.lang ='es';
        APIservice.getDevices($rootScope.lang).success(function (response) {
                $rootScope.devices = response;
        });
        $rootScope.getDevices = function($event,lang) {
          Analytics.trackEvent('change apple store', lang);
          $rootScope.lang =lang;
          $event.preventDefault();
          $rootScope.devices = null;
           APIservice.getDevicesUrl(lang).success(function (response) {
                $rootScope.devices = response;
            });

        };
  })
  .controller('GridCtrl', function($scope) {

  })
  .controller('TranslateTextCtrl', function($scope, gettextCatalog,Analytics) {
        $scope.languages = ['en','de','fr','ca'];
        $scope.lang = 'en';
        $scope.changeLanguage = function() {
            Analytics.trackEvent('change apple store', lang);
            $scope.$parent.newFilter = '';
            gettextCatalog.currentLanguage = $scope.lang;
        };
  })
  .controller('LeftMenuCtrl', function($scope,APIservice,Analytics) {
        $scope.onSelectItem = function (item) {
          Analytics.trackEvent('select category', item);
          $scope.$parent.newFilter = item;
        }
  });


'use strict';

/* Directives */

angular.module('myApp.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]);

'use strict';

/* Filters */

angular.module('myApp.filters', []).
    filter('truncate', function () {
        return function (text, length, end) {
            if (isNaN(length))
                length = 10;

            if (end === undefined)
                end = "...";

            if (text.length <= length || text.length - end.length <= length) {
                return text;
            }
            else {
                return String(text).substring(0, length-end.length) + end;
            }

        };
    });
'use strict';

/* Services */

angular.module('myApp.services', []).
  service('APIservice', function($http, _, ngProgress) {
    var _devicesCached = {};
    var refurbishyAPI = {};
    refurbishyAPI.getDevicesUrl = function(lang) {
      var baseUrl = '../../products_new_'+lang+'.json';
      var products = $http({
        method: 'get',
        url: baseUrl,
        cache: false
      });
      console.log('Load products from '+ baseUrl);
      this.setDevices ( lang, products );
      return products;
    }

    refurbishyAPI.setDevices = function( lang,devices ) {
      _devicesCached[lang] = devices;
      ngProgress.stop();
      console.log('set devices');
      console.log(_devicesCached);
    }

    refurbishyAPI.getDevicesCached = function(lang) {
      console.log('get products cached '+ _.keys(_devicesCached));
      return _devicesCached[lang];
    }

    refurbishyAPI.getDevices = function(lang) {
      if (_devicesCached[lang] === undefined){
        console.log('get deviced not cached');
        var devices = this.getDevicesUrl(lang);
        return devices;
      }else{
        console.log('get devices cached');
        return this.getDevicesCached(lang);
      }
    }

    console.log(refurbishyAPI);
    return refurbishyAPI;
  }).factory('state', function () {
    'use strict';

    var state= { state : "null"};

    state.setState = function( status ) {
      state.data =  status;
    }
    state.getState = function( ) {
      return state.data;
    }

    return state;
  });



var underscore = angular.module('underscore', []);
underscore.factory('_', function() {
  return window._; // assumes underscore has already been loaded on the page
});