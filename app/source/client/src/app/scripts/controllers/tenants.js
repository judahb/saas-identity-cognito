'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:TenantsCtrl
 * @description
 * # TenantsCtrl
 * Controller of the clientApp
 */
angular.module('clientApp').controller('TenantsCtrl', function ($scope, $http, $rootScope, Constants) {
//New Relic Code for SPA
  newrelic.interaction()
    .setAttribute('session_id', $rootScope.session_id)
    .setAttribute('role', $rootScope.userRole)
    .setAttribute('tenant_id', $rootScope.tenant_id)
    .setAttribute('username', $rootScope.currentUser)
    .setAttribute('action', "tenants")
    .save();
  $http.get(Constants.TENANT_MANAGER_URL + '/tenants')
    .then(function(response) {
      $scope.tenants = response.data;
    })
    .catch(function(response) {
      console.error('Error getting tenants', response.status, response.data);
    })
    .finally(function() {
      console.log('Finished getting tenants');
    });
});
