angular.module('App', ['LocationBar'])
.controller('MainController', ['$scope', function ($scope) {
  $scope.todos = [];

  $scope.newTitle = '';

  $scope.addTodo = function () {
    $scope.todos.push({
      title: $scope.newTitle,
      done: false
    });

    $scope.newTitle = '';
  };
}]);
