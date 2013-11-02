// サービスはこんなことに使えますという説明のためのコードです。
// 悪い実装なので真似しないでください。

angular.module('Example', ['LocationBar'])
.value('lines', [])
// `getSubtotal` is common business logic.
.factory('getSubtotal', [function () {
  return function (line) {
    return line.unitPrice * line.count;
  };
}])
.controller('MainCtrl', ['$scope', 'lines', 'getSubtotal',
function (scope, lines, getSubtotal) {
  var line = this;

  function reset() {
    line.productName = null;
    line.unitPrice = 0;
    line.count = 0;
  }

  scope.add = function () {
    lines.push({
      productName: line.productName,
      unitPrice: line.unitPrice,
      count: line.count
    });
    reset();
  };

  scope.getSubtotal = getSubtotal;

  reset();
}])
.controller('SubCtrl', ['lines', 'getSubtotal',
function (lines, getSubtotal) {
  this.lines = lines;

  this.getTotalAmount = function () {
    return this.lines.reduce(function (totalAmount, line) {
      return totalAmount + getSubtotal(line);
    }, 0);
  };

  this.getSubtotal = getSubtotal;
}]);
