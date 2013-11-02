angular.module('Example', ['LocationBar'])
.value('random', function (n) {
  n = n || 9;
  return Math.round(Math.random() * n);
})
.controller('Ctrl1', ['$scope', 'random', function (scope, random) {
  scope.value = 0;
  scope.$watch('value', function (val, old) {
    scope.square = val * val;
    scope.old = old;
  });
  scope.change = function () {
    scope.value = random();
  };
}])
.controller('Ctrl2', ['$scope', 'random', function (scope, random) {
  var n = 0;
  scope.$watch(function() { return n; }, function (val, old) {
    scope.value = val;
    scope.square = val * val;
    scope.old = old;
  });
  scope.change = function () {
    n = random();
  };
}])
.controller('Ctrl3', ['$scope', 'random', function (scope, random) {
  scope.original = {};
  scope.$watch('original', function (val) {
    scope.clone1 = angular.copy(val);
  });
  scope.$watch('original', function (val) {
    scope.clone2 = angular.copy(val);
  }, true);
  scope.$watchCollection('original', function (val) {
    scope.clone3 = angular.copy(val);
  });
  scope.change = function () {
    var num = random();

    scope.original[random(2)] = num * num;
  };
}])
.controller('Ctrl4', ['$scope', 'random', function (scope, random) {
  scope.original = [
    {value: random()}
  ];
  scope.$watch('original', function (val) {
    scope.clone1 = angular.copy(val);
  });
  scope.$watch('original', function (val) {
    scope.clone2 = angular.copy(val);
  }, true);
  scope.$watchCollection('original', function (val) {
    scope.clone3 = angular.copy(val);
  });
  scope.change = function () {
    scope.original[0].value = random();
  };
}]);
