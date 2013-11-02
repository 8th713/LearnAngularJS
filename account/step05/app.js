angular.module('App', ['ngRoute', 'LocationBar'])
.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'index-tmpl',
      controller: 'SheetListController'
    })
    .when('/new', {
      templateUrl: 'new-tmpl',
      controller: 'CreationController'
    })
    .when('/sheet/:id', {
      templateUrl: 'sheet-tmpl',
      controller: 'SheetController'
    })
    .otherwise({
      redirectTo: '/'
    });
}])
.controller('SheetListController', [function SheetListController() {/* 一覧用 */}])
.controller('CreationController', ['$scope', function CreationController($scope) {
  function createOrderLine() {
    return {
      productName: '',
      unitPrice: 0,
      count: 0
    };
  }

  $scope.initialize = function () {
    $scope.lines = [createOrderLine()];
  };

  $scope.addLine = function () {
    $scope.lines.push(createOrderLine());
  };

  $scope.removeLine = function (target) {
    var lines = $scope.lines;
    var index = lines.indexOf(target);

    if (index !==  -1) {
      lines.splice(index, 1);
    }
  };

  $scope.save = function () {};

  $scope.getSubtotal = function (orderLine) {
    return orderLine.unitPrice * orderLine.count;
  };

  $scope.getTotalAmount = function (lines) {
    var totalAmount = 0;

    angular.forEach(lines, function (orderLine) {
      totalAmount += $scope.getSubtotal(orderLine);
    });

    return totalAmount;
  };

  $scope.initialize();
}])
.controller('SheetController', [function SheetController() {/* 詳細用 */}]);
