angular.module('Learn.directives', [])
.directive('navbarToggle', [function () {
  function openMenu(targetId) {
    var $target = angular.element(document.getElementById(targetId));

    $target.toggleClass('in');
  }

  return {
    restrict: 'C',
    link: function (scope, $el, attrs) {
      $el.on('click', function () {
        openMenu(attrs.targetId);
      });
    }
  };
}])
.directive('dropdownToggle', ['$document', function ($doc) {
  var opened;

  function clearMenus() {
    if (opened) {
      opened.removeClass('open');
      opened = false;
      $doc.off('click', clearMenus);
    }
  }

  function openMenu(evt) {
    evt.preventDefault();

    if (opened) {
      return;
    }

    opened = angular.element(this).parent().addClass('open');
    setTimeout(function () {
      $doc.on('click', clearMenus);
    });
  }

  return {
    restrict: 'C',
    link: function (scope, $el) {
      $el.on('click', openMenu);
    }
  };
}])
.directive('actively', [function () {
  return function (scope, $el, attrs) {
    var thisPath = scope.$eval(attrs.actively);

    scope.$watch('currentPath', function (value) {
      $el.toggleClass('active', value === thisPath);
    });
  };
}])

.directive('preview', ['$location', function ($location) {
  return {
    template:
      '<h2>{[ title ]}</h2>' +
      '<iframe class="preview" ng-src="{[ url + preview ]}"></iframe>' +
      '<div tabs>' +
        '<div ng-repeat="file in files" pane="{[ file ]}">' +
          '<pre code-src="{[ url + file ]}" />' +
        '</div>' +
      '</div>',
    scope: {},
    link: function (scope, $el, attrs) {
      var data = scope.$parent.$eval(attrs.preview);

      angular.extend(scope, data);
      scope.url = '.' + $location.path() + '/';
      scope.preview = data.files[0];

      if (attrs.hash) {
        scope.preview += '#' + attrs.hash;
      }

      if (attrs.size) {
        $el.find('iframe').css('min-height', attrs.size + 'px');
      }
    }
  };
}])
.directive('tabs', [function () {
  return {
    template:
      '<div class="tabbable"><ul class="nav nav-tabs">' +
        '<li ng-repeat="pane in panes" ng-class="{active: pane.selected}">'+
          '<a href="" ng-click="select(pane)">{[ pane.title ]}</a>' +
        '</li>' +
      '</ul>' +
      '<div class="tab-content tab-content-code" ng-transclude></div></div>',
    replace: true,
    transclude: true,
    scope: {},
    controller: ['$scope', function(scope) {
      var panes = scope.panes = [];

      scope.select = function(pane) {
        angular.forEach(panes, function(pane) {
          pane.selected = false;
        });
        pane.selected = true;
      };

      this.addPane = function(pane) {
        if (!panes.length) {
          scope.select(pane);
        }
        panes.push(pane);
      };
    }]
  };
}])
.directive('pane', [function () {
  return {
    template: '<div class="tab-pane" ng-class="{active: selected}" ng-transclude></div>',
    replace: true,
    require: '^tabs',
    transclude: true,
    scope: { title: '@pane' },
    link: function(scope, element, attrs, tabsCtrl) {
      tabsCtrl.addPane(scope);
    }
  };
}])
.directive('codeSrc', ['$http', '$templateCache', function ($http, $templateCache) {
  var hljs = window.hljs;

  hljs.LANGUAGES.js = hljs.LANGUAGES.javascript;
  hljs.LANGUAGES.html = hljs.LANGUAGES.xml;

  return {
    template: '<code></code>',
    link: function link(scope, $el, attrs) {
      var url = attrs.codeSrc;
      var ext = url.match(/\.(\w+)$/)[1];

      $http.get(url, {cache: $templateCache}).success(function (data) {
        var obj = hljs.highlight(ext, data);

        $el.find('code').html(obj.value);
      });
    }
  };
}])

.directive('scrollTop', [function () {
  return function (scope, $el) {
    $el.on('click', function () {
      window.scrollTo(window.scrollX, 0);
    });
  };
}])
.directive('pager', [function () {
  return {
    template:
      '<ul class="pager">' +
        '<li ng-show="prev" class="previous">' +
          '<a ng-href="#/{[ group.id ]}/{[ prev.id ]}">' +
            '<span class="glyphicon glyphicon-chevron-left"></span> 前のステップへ' +
          '</a>' +
        '</li>' +
        '<li ng-show="next" class="next">' +
          '<a ng-href="#/{[ group.id ]}/{[ next.id ]}">' +
            '次のステップへ <span class="glyphicon glyphicon-chevron-right"></span>' +
          '</a>' +
        '</li>' +
      '</ul>',
    replace: true,
    scope: true,
    link: function (scope, $el) {
      var group = scope.group;
      var index = group.articles.indexOf(scope.article);

      scope.prev = group.articles[index - 1];
      scope.next = group.articles[index + 1];
      $el.toggleClass('ng-hide', !group.pager);
    }
  };
}]);
