'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:UsersCtrl
 * @description
 * # UsersCtrl
 * Controller of the clientApp
 */
angular.module('clientApp').controller('UsersCtrl', function ($scope, $http, $rootScope, Constants) {
//New Relic Code for SPA
  newrelic.interaction()
    .setAttribute('session_id', $rootScope.session_id)
    .setAttribute('role', $rootScope.userRole)
    .setAttribute('tenant_id', $rootScope.tenant_id)
    .setAttribute('username', $rootScope.currentUser)
    .setAttribute('action', "users")
    .save();
  $http.get(Constants.USER_MANAGER_URL + '/users')
    .then(function (response) {
      $scope.users = response.data;
    })
    .catch(function (response) {
      console.error('Error getting users', response.status, response.data);
    })
    .finally(function () {
      console.log('Finished getting users');
    });
});
