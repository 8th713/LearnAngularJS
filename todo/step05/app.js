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

  $scope.filter = {
    done: { done: true },
    remaining: { done: false }
  };
  $scope.currentFilter = null;

  $scope.changeFilter = function (filter) {
    $scope.currentFilter = filter;
  };
}]);
