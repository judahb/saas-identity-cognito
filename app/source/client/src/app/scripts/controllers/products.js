'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:ProductsCtrl
 * @description
 * # ProductsCtrl
 * Controller of the clientApp
 */
angular.module('clientApp').controller('ProductsCtrl', function ($scope, $http, $rootScope, Constants) {
  $http.get(Constants.PRODUCT_MANAGER_URL + '/products')
    .then(function(response) {
      $scope.products = response.data;
    })
    .catch(function(response) {
      console.error('Error getting products', response.status, response.data);
    })
    .finally(function() {
      console.log('Finished getting products');
      //New Relic Code for SPA
      newrelic.interaction()
        .setAttribute('session_id', $rootScope.session_id)
        .setAttribute('role', $rootScope.userRole)
        .setAttribute('tenant_id', $rootScope.tenant_id)
        .setAttribute('username', $rootScope.currentUser)
        .setAttribute('action', "products")
        .save();
    });
});
