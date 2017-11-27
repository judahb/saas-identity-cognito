'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:ProductViewCtrl
 * @description
 * # ProductViewCtrl
 * Controller of the clientApp
 */
angular.module('clientApp').controller('ProductViewCtrl', function ($scope, $location, $http, $route, $routeParams, $rootScope, Constants) {

  $http.get(Constants.PRODUCT_MANAGER_URL + '/product/' + $routeParams.id)
    .then(function (response) {
      //New Relic Code for SPA
      newrelic.interaction()
        .setAttribute('session_id', $rootScope.session_id)
        .setAttribute('role', $rootScope.userRole)
        .setAttribute('tenant_id', $rootScope.tenant_id)
        .setAttribute('username', $rootScope.currentUser)
        .setAttribute('action', "product-view")
        .save();
      $scope.product = response.data;
    })
    .catch(function (response) {
      console.log('Error getting product: ' + response.message);
    })
    .finally(function () {
      console.log('Finished getting product');
    });
});
