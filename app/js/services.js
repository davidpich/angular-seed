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