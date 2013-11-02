$watch メソッドを使ってモデルの変更時の振る舞いを追加しましょう。

## ToDo リストモデルの変更を監視する
絞り込み表示ができるようになりましたがボタンに表示する件数が仮値のままです。
正しい件数を表示出来るようにしましょう。

未了、完了の件数はリスト内の Todo モデルの総数や状態の変更に合わせて更新する必要があります。
[$scope.$watch](http://docs.angularjs.org/api/ng.$rootScope.Scope#$watch) メソッドを使ってリストが変更された時に正しい件数に更新されるモデルを作成しましょう。

```javascript
$scope.$watch('todos', function (todos) {
  // todos が増減したり各要素のプロパティが変更された時に実行される
}, true);
```

配列の増減と配列内の ToDo の done プロパティを監視するため第三引数(objectEquality フラグ)を true に設定します。
これを忘れると関数が実行されるのが todos に新しい値が代入された時だけになってしまいますので注意してください。

### コントローラからフィルタを使用する
未了、完了の件数を得るためにはリストから合致する要素だけを抽出する必要があります。
この処理は先ほどのステップで使用したコアモジュールの filter フィルタが実現していたものと同じです。

コントローラで特定のフィルタを使用したい場合 [$filter サービス](http://docs.angularjs.org/api/ng.$filter)を使ってフィルタを取得することができます。
アノテーション配列を編集しコンストラクタが $filter サービスを受け取れるようにしましょう。

```javascript
.controller('MainController', ['$scope', '$filter', function ($scope, $filter) {
  // 省略

  var where = $filter('filter'); // filter フィルタ関数の取得
  $scope.$watch('todos', function (todos) {
    var length = todos.length;

    $scope.allCount = length;                                   // 総件数モデル
    $scope.doneCount = where(todos, $scope.filter.done).length; // 完了件数モデル
    $scope.remainingCount = length - $scope.doneCount;          // 未了件数モデル
  }, true);
}]);
```

filter 関数(変数 where)を利用して完了した ToDo だけの配列を取得しその長さを完了件数モデルとしました。
さらに、総件数から完了件数を引いた値を利用して未了件数モデルに代入します。

$scope.$watch に登録された関数はコントローラがインスタンス化された時初期化処理として一度実行されるので関数外で各モデルの初期値を定義しておく必要はありません。

最後にモックアップを編集して各モデルを表示しましょう。

```html
<button class="active">全部 <span>{{ allCount }}</span></button>
<button>未了 <span>{{ remainingCount }}</span></button>
<button>完了 <span>{{ doneCount }}</span></button>
```

<div preview="article.examples.example"></div>

### $watch メソッドを使用しない実装方法
慣れないうちは $watch は少々扱いづらいので別のアプローチでの実装法も紹介します。

```javascript
$scope.getDoneCount = function () {
  return where($scope.todos, $scope.filter.done).length;
};
```

```html
<button class="active">全部 <span>{{ todos.length }}</span></button>
<button>未了 <span>{{ todos.length - getDoneCount() }}</span></button>
<button>完了 <span>{{ getDoneCount() }}</span></button>
```

ビューは $scope からの更新通知を受け取ると式を再評価するためこの実装は結果的に $watch メソッドを使った実装と
同じことになります。

ただし $watch を使った実装ならば再評価時の動作は単純なプロパティ参照で済むのに対し、この実装は再評価時に必ず関数を実行するため多用するとパフォーマンスが低下する可能性があります。
