angular.module('Example', ['LocationBar'])
.directive('countup', [function () {
  function up(scope) {
    scope.count++;
    if (scope.count === scope.max) {
      scope.count = 0;
      scope.$emit('complate');
    }
  }

  return {
    template: 'click <span class="badge">{{ count }}</span>',
    scope: true,
    link: function (scope, $el, attrs) {
      scope.count = 0;
      scope.max = +attrs.countup;

      $el.on('click', function () {
        scope.$apply(up);
      });
    }
  };
}])
.controller('Ctrl', ['$scope', function Ctrl($scope) {
  $scope.toggle = false;

  $scope.$on('complate', function () {
    $scope.toggle = !$scope.toggle;
  });
}]);
