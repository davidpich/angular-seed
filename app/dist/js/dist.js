/**
 * Refurbishy web app
 * v0.0.1
 *
 * Copyright (c)2015 David Pich
 * Distributed under BSD-2-Clause license
 *
 * http://davidpich.com
 */

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

'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
 .controller('AppCtrl', function($rootScope, $scope, APIservice, state, Analytics,$mdSidenav,$mdDialog) {
        $rootScope.lang ='es';
        $scope.selectedIndex = null;
        $rootScope.languages = ['es','en','de','fr','ca'];

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
                $mdDialog.hide();
            });
        };
        $scope.showAdvanced = function(ev) {
          $mdDialog.show({
            controller: DialogController,
            templateUrl: 'partials/dialog.tmpl.html',
            targetEvent: ev,
          })
          .then(function(answer) {
            $mdDialog.hide();
          }, function() {
            $mdDialog.hide();
          });
        };
        $scope.toggleMenu = function() {
          $mdSidenav('left').toggle();
        };
        $scope.onSelectItem = function (item, index) {
          Analytics.trackEvent('select category', item);
          $scope.selectedIndex = index;
          $scope.$parent.newFilter = item;
        };
        function DialogController($scope, $mdDialog) {
          $scope.hide = function() {
            $mdDialog.hide();
          };
          $scope.cancel = function() {
            $mdDialog.cancel();
          };
          $scope.answer = function(answer) {
            $mdDialog.hide(answer);
          };
        }


  })
  .controller('LeftSideCtrl', function($scope) {
    $scope.close = function() {
      $mdSidenav('left').close()
      .then(function(){
        $log.debug("close LEFT is done");
      });
    };
  })

  .controller('DetailProductCtrl', function($scope) {

  })
  .controller('TranslateTextCtrl', function($scope, gettextCatalog,Analytics) {
        $scope.languages = ['en','de','fr','ca'];
        $scope.lang = 'en';
        $scope.changeLanguage = function() {
            Analytics.trackEvent('change apple store', lang);
            $scope.$parent.newFilter = '';
            gettextCatalog.currentLanguage = $scope.lang;
        };
        $scope.onSelectItem = function (item) {
          Analytics.trackEvent('select category', item);
          $scope.$parent.$parent.newFilter = item;
        }
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
  service('APIservice', function($http) {
    var _devicesCached = {};
    var refurbishyAPI = {};
    refurbishyAPI.getDevicesUrl = function(lang) {
      var baseUrl = '../../products_new_'+lang+'.json';
      var products = $http({
        method: 'get',
        url: baseUrl,
        cache: false
      });
      this.setDevices ( lang, products );
      return products;
    }

    refurbishyAPI.setDevices = function( lang,devices ) {
      _devicesCached[lang] = devices;
    }

    refurbishyAPI.getDevicesCached = function(lang) {
      return _devicesCached[lang];
    }

    refurbishyAPI.getDevices = function(lang) {
      if (_devicesCached[lang] === undefined){
        var devices = this.getDevicesUrl(lang);
        return devices;
      }else{
        return this.getDevicesCached(lang);
      }
    }
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