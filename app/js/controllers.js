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
