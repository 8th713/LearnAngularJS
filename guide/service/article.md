## 役割
サービスは以下の役割を果たすために使用されるものです。

* アプリケーション共通のオブジェクトを定義する。

コントローラやディレクティブ、フィルタなどで共通して使われる値や関数を定義する場所です。

## 使う
サービスを使用したいコントローラなどのアノテーション配列にサービス名を列挙します。

```javascript
module.controller('Ctrl', ['$scope', '$http', '$timeout', function (scope, $http, $timeout) {
  $http.get('/data').success(function (data) {
    scope.data = data;
  });

  $timeout(function () {
    scope.elapsed = true;
  }, 1000);
}]);
```

アノテーション配列の最後の関数がサービスを受け取ります。

## 作る
module インスタンスの factory, service, value などのメソッドで新しいサービスを定義できます。

いずれのメソッドも第一引数にサービスの名前を受け取ります。
factory と service は第二引数にアノテーション配列を受け取ります。

factory メソッドのアノテーション配列の最後はファクトリ関数です。
ファクトリ関数が返すべきものはサービスとなるオブジェクトです。
ファクトリ関数は作成したサービスがはじめて依存注入された時に一度だけ実行されます。
2回目以降の依存注入では初回で作成されたサービスが渡されます。

```javascript
module.factory('delayOneSecond', ['$timeout', function ($timeout) {
  return function (callback) {
    return $timeout(callbak, 1000);
  };
}]);
```

service メソッドのアノテーション配列の最後はコンストラクタです。
コンストラクタは作成したサービスがはじめて依存注入された時に一度だけインスタンス化されます。
2回目以降の依存注入では初回で作成されたインスタンスが渡されます。

```javascript
module.service('storage', [function () {
  var storage = {};

  function getLange() {
    return Object.keys(storage).length;
  }

  this.length = 0;

  this.get = function (key) {
    return storage[key];
  };

  this.getAll = function () {
    return angular.copy(storage);
  };

  this.set = function (key, value) {
    storage[key] = value;
    this.length = getLange();
  };

  this.remove = function (key) {
    delete storage[key];
    this.length = getLange();
  };
}]);
```

value メソッドの第二引数はサービスそのものを受け取ります。

```javascript
module.value('data', [
  {id: 1, name: 'Alice'},
  {id: 2, name: 'Bob'},
  {id: 3, name: 'Charlie'}
]);
```

<div class="alert alert-info">
**Tip:**
config ブロックで設定を変更できるような高度なサービスを作成する方法として provider メソッドも提供されています。
</div>

<div class="alert alert-info">
**Tip:**
アプリケーション共通の定数定義を作成する手段として constant も提供されています。
constant で作成されたサービスは config ブロックでも取得できます。
</div>

<div preview="article.examples.example" size="340"></div>
