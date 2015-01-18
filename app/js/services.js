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