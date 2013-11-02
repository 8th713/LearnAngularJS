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

  var originalTitle;
  $scope.editing = null;

  $scope.editTodo = function (todo) {
    originalTitle = todo.title;
    $scope.editing = todo;
  };

  $scope.doneEdit = function (todoForm) {
    if (todoForm.$invalid) {
      $scope.editing.title = originalTitle;
    }
    $scope.editing = originalTitle = null;
  };

  $scope.checkAll = function () {
    var state = !!$scope.remainingCount;

    angular.forEach($scope.todos, function (todo) {
      todo.done = state;
    });
  };

  $scope.removeDoneTodo = function () {
    $scope.todos = where($scope.todos, $scope.filter.remaining);
  };

  $scope.removeTodo = function (currentTodo) {
    $scope.todos = where($scope.todos, function (todo) {
      return currentTodo !== todo;
    });
  };
}])
.directive('mySelect', [function () {
  return function (scope, $el, attrs) {
    scope.$watch(attrs.mySelect, function (val) {
      if (val) {
        $el[0].select();
      }
    });
  };
}]);
