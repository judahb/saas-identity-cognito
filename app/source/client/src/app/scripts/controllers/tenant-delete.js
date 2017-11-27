'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:TenantDeleteCtrl
 * @description
 * # TenantDeleteCtrl
 * Controller of the clientApp
 */
angular.module('clientApp').controller('TenantDeleteCtrl', function ($scope, $location, $http, $route, $routeParams, $rootScope, Constants) {
//New Relic Code for SPA
  newrelic.interaction()
    .setAttribute('session_id', $rootScope.session_id)
    .setAttribute('role', $rootScope.userRole)
    .setAttribute('tenant_id', $rootScope.tenant_id)
    .setAttribute('username', $rootScope.currentUser)
    .setAttribute('action', "tenant-delete")
    .save();
  // fetch the item to delete
  $http.get(Constants.TENANT_MANAGER_URL + '/tenant/' + $routeParams.id)
    .then(function(response) {
      $scope.tenant = response.data;
    })
    .catch(function(response) {
      $scope.error = "Error getting tenant: " + response.message;
      console.log('Error getting tenant: ' + response.message);
    })
    .finally(function() {
      console.log('Finished getting tenant');
    });


  $scope.deleteTenant = function() {
    var tenantKey = {
      'id': $scope.tenant.id,
      'title': $scope.tenant.title
    };

    $http.delete(Constants.TENANT_MANAGER_URL + '/tenant/' + $scope.tenant.id)
      .then(function (response) {
        console.log('Tenant delete');
        $location.path('/tenants');
      })
      .catch(function (response) {
        $scope.error = "Error deleting tenant: " + response.message;
        console.log("Error deleting tenant: " + response.message);
      })
  };

  $scope.back = function() {
    $location.path('/tenants');
  };
});
