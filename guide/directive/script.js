angular.module('Example', ['LocationBar'])
.directive('myDialog', [function () {
  return function (scope, $el, attrs) {
    $el.on('click', function () {
      window.alert('Hello ' + attrs.myDialog);
    });
  };
}])
.directive('myDetails', [function () {
  return {
    template: '<div class="panel panel-default">' +
                '<div class="panel-heading" ng-style="borderWidth">' +
                  '<h3 class="panel-title">' +
                    '<a href="" ng-click="toggle()"><span class="glyphicon" ng-class="icon"></span> {{ title }}</a>' +
                  '</h3>' +
                '</div>' +
                '<div class="panel-body" ng-transclude ng-hide="hidden"></div>' +
              '</div>',
    transclude: true,
    scope: {
      title: '@myDetails'
    },
    link: function (scope) {
      function open() {
        scope.hidden = false;
        scope.icon = 'glyphicon-chevron-down';
        scope.borderWidth = {
          'border-bottom-width' : 1
        };
      }

      function close() {
        scope.hidden = true;
        scope.icon = 'glyphicon-chevron-right';
        scope.borderWidth = {
          'border-bottom-width' : 0
        };
      }

      open();
      scope.toggle = function () {
        if (scope.hidden) {
          open();
        } else {
          close();
        }
      };
    }
  };
}]);
