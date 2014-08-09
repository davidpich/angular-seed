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

