残っているビジネスロジックは全て今まで使ってきた機能だけで実装できます。

```javascript
// 全て完了/未了
$scope.checkAll = function () {
  var state = !!$scope.remainingCount; // 未了にするのか完了にするのかの判定

  angular.forEach($scope.todos, function (todo) {
    todo.done = state;
  });
};

// 完了した ToDo を全て削除
$scope.removeDoneTodo = function () {
  $scope.todos = where($scope.todos, $scope.filter.remaining);
};

// 任意の ToDo を削除
$scope.removeTodo = function (currentTodo) {
  $scope.todos = where($scope.todos, function (todo) {
    return currentTodo !== todo;
  });
};
```

それぞれの関数を ngClick ディレクティブでボタンと結びつければ完了です。

removeTodo メソッド内で where 関数に対して関数を渡している点に注意してください。
これは単純に関数の戻り値が true の要素だけを抽出する処理です。

<div preview="article.examples.example"></div>
