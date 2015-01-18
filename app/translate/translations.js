angular.module('gettext').run(['gettextCatalog', function (gettextCatalog) {
/* jshint -W100 */
    gettextCatalog.setStrings('en', {"products":"products","select store":"Select store"});
    gettextCatalog.setStrings('es', {"Search for something...":"Busca algo...","products":"productos","select store":"Selecciona tienda"});
/* jshint +W100 */
}]);