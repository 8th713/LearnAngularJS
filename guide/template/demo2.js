angular.module('Example', ['LocationBar'])
.run(['$rootScope', function (scope) {
  scope.count = 0;
  scope.string = 'Hello world';

  scope.countUp = function () {
    scope.count++;
  };

  scope.delay = function () {
    setTimeout(function () {
      scope.count += 100;
      scope.$apply(); // 手動更新
    }, 2000);
  };
}]);
