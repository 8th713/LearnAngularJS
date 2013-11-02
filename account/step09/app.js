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
.service('sheets', [function () {
  this.list = [];

  this.add = function (lines) {
    this.list.push({
      id: String(this.list.length + 1),
      createdAt: Date.now(),
      lines: lines
    });
  };

  this.get = function (id) {
    var list = this.list;
    var index = list.length;
    var sheet;

    while (index--) {
      sheet = list[index];
      if (sheet.id === id) {
        return sheet;
      }
    }
    return null;
  };
}])
.service('counting', function () {
  this.getSubtotal = function (orderLine) {
    return orderLine.unitPrice * orderLine.count;
  };

  this.getTotalAmount = function (lines) {
    var totalAmount = 0;

    angular.forEach(lines, function (orderLine) {
      totalAmount += this.getSubtotal(orderLine);
    }, this);

    return totalAmount;
  };
})
.service('sheetAction', ['$location', 'sheets',
function ($location, sheets) {
  function createOrderLine() {
    return {
      productName: '',
      unitPrice: 0,
      count: 0
    };
  }

  this.initialize = function () {
    this.lines = [createOrderLine()];
  };

  this.addLine = function () {
    this.lines.push(createOrderLine());
  };

  this.removeLine = function (target) {
    var lines = this.lines;
    var index = lines.indexOf(target);

    if (index !==  -1) {
      lines.splice(index, 1);
    }
  };

  this.save = function () {
    sheets.add(this.lines);
    $location.path('/');
  };
}])
.controller('SheetListController', ['$scope', 'sheets',
function SheetListController($scope, sheets) {
  $scope.list = sheets.list;
}])
.controller('CreationController', ['$scope',  'counting', 'sheetAction',
function CreationController($scope, counting, sheetAction) {
  angular.extend($scope, sheetAction);
  angular.extend($scope, counting);

  $scope.integer = /^\d+$/;

  $scope.$watch('lines.length < 2', function (val) {
    $scope.disabledDelBtn = val;
  });

  $scope.initialize();
}])
.controller('SheetController', ['$scope', '$routeParams', 'sheets', 'counting',
function SheetController($scope, $params, sheets, counting) {
  angular.extend($scope, sheets.get($params.id));
  angular.extend($scope, counting);
}]);
