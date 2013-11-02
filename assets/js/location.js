angular.module('LocationBar', [])
.directive('locationBar', ['$location', function ($location) {
  return {
    restrict: 'C',
    replace: true,
    template:
      '<div class="input-group">' +
        '<span class="input-group-addon">' +
          '<span class="glyphicon glyphicon-file"></span>' +
        '</span>' +
        '<input type="url" readonly class="form-control" value="{{ url }}">' +
        '<span class="input-group-btn">' +
          '<a class="btn btn-success" target="_blank" title="別窓で表示する" ng-href="{{ url }}">' +
            '<span class="glyphicon glyphicon-new-window"></span>' +
          '</a>' +
        '</span>' +
      '</div>',
    scope: {},
    link: function (scope, $el) {
      if (!window.frameElement) {
        $el.css('display', 'none');
        return;
      }

      scope.$watch(function () {
        return $location.absUrl();
      }, function (url) {
        scope.url = url;
      });
    }
  };
}]);
