angular.module('Example', ['LocationBar'])
.controller('UserController', ['$scope', function ($scope) {
  // users model initial value
  $scope.users = [
    {name: 'foo', email: 'bar@example.com'}
  ];

  // add a new user, and then run the reset.
  $scope.addUser = function () {
    $scope.users.push({
      name: $scope.name,
      email: $scope.email
    });
    reset();
  };

  // Initialize name and email model.
  function reset() {
    $scope.name = null;
    $scope.email = null;
  }

  // Not required.
  reset();
}]);
