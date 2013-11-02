angular.module('Example', ['LocationBar'])
.filter('omit', [function () {
  var defaultLength = 100;
  var defaultChar = '…';

  return function (arg, len, char) {
    len = len || defaultLength;

    if (angular.isString(arg) && arg.length > len) {
      return arg.slice(0, len) + (char || defaultChar);
    }
    return arg;
  };
}])
.filter('odd', [function () {
  return function (arg) {
    if (!angular.isArray(arg)) {
      return arg;
    }

    return arg.filter(function (n) {
      return n % 2;
    });
  };
}])
.filter('sum', [function () {
  return function (arg) {
    if (!angular.isArray(arg)) {
      return arg;
    }

    return arg.reduce(function (sum, n) {
      n = +n;
      return sum + (!isNaN(n) ? n : 0);
    }, 0);
  };
}]);
