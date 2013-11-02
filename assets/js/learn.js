angular.module('Learn', ['ngRoute', 'Learn.directives', 'Data'])
.config(['$interpolateProvider', '$routeProvider',
function ($interpolateProvider, $routeProvider) {
  $interpolateProvider
    .startSymbol('{[')
    .endSymbol(']}');

  $routeProvider
    .when('/', {
      templateUrl: 'start-tmpl'
    })
    .when('/:group', {
      templateUrl: 'index-tmpl',
      controller: 'ListController'
    })
    .when('/:group/:id', {
      templateUrl: 'article-tmpl',
      controller: 'ArticleController'
    })
    .otherwise({
      redirectTo: '/'
    });
}])
.service('finder', ['$routeParams', 'models',
function (params, models) {
  function find(arr, id) {
    var i = arr.length;
    var el;

    while (i--) {
      el = arr[i];
      if (el.id === id) {
        return el;
      }
    }
    return;
  }

  function findGroup() {
    return find(models, params.group);
  }

  function findArticle() {
    var groupName = params.group;
    var id = params.id;
    var group = findGroup();

    return {
      group: group,
      article: find(group.articles, params.id),
      url: groupName + '/' + id + '/article.html'
    };
  }

  this.findGroup = findGroup;
  this.findArticle = findArticle;
}])
.run(['$rootScope', '$location', 'models',
function MainController(scope, $location, models) {
  scope.models = models;
  scope.currentGroup = null;
  scope.currentPath = $location.path();

  scope.$on('$routeChangeStart', function (evt, route) {
    scope.currentGroup = route.params.group;
    scope.currentPath = $location.path();
  });
}])
.controller('ListController', ['$scope', 'finder',
function ListController(scope, finder) {
  angular.extend(scope, finder.findGroup());
}])
.controller('ArticleController', ['$scope', 'finder',
function ArticleController(scope, finder) {
  angular.extend(scope, finder.findArticle());
}]);
