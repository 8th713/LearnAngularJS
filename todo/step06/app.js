angular.module('App', ['LocationBar'])
.controller('MainController', ['$scope', '$filter', function ($scope, $filter) {
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

  var where = $filter('filter');
  $scope.$watch('todos', function (todos) {
    var length = todos.length;

    $scope.allCount = length;
    $scope.doneCount = where(todos, $scope.filter.done).length;
    $scope.remainingCount = length - $scope.doneCount;
  }, true);
}]);
