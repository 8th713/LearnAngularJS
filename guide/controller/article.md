## 役割
AngularJS のコントローラは以下の役割を果たすために使用されるものです。

* $scope オブジェクトにプロパティを追加しモデルを作成する。
* $scope オブジェクトにメソッドを追加しビューから参照できるようにする。

コントローラはビューに一切依存せずにモデルの操作のみに集中する場所です。

## 作る
module インスタンスの controller メソッドでモジュールに新しいコントローラを定義できます。

```javascript
module.controller('UserController', ['$scope', function UserController($scope) {
  // users model initial value
  $scope.users = [
    {name: 'foo', email: 'bar@example.com'}
  ];

  // submit event listener
  $scope.addUser = function () {
    $scope.users.push({
      name: $scope.name,
      email: $scope.email
    });
    reset();
  };

  // reset name and email model
  function reset() {
    $scope.name = null;
    $scope.email = null;
  }

  // initialize name and email model
  reset();
}]);
```

第一引数がコントローラの名前になります。
第二引数はアノテーション配列です。

アノテーション配列の最後にはコンストラクタを含めます。

AngularJS ではグローバルスコープに定義した関数も暗黙的にコントローラとして扱います。
ただしこの方法は推奨されていません。
必ず module.controller メソッドを使うようにしてください。

## 使う
`ng-controller` ディレクティブを使用することでコントローラとビューを関連付けます。
属性値にコントローラの名前を指定することでディレクティブが解決される時そのコントローラはインスタンス化されます。

```html
<div ng-controller="UserController">
  <form ng-submit="addUser()">
    <input type="text" ng-model="name">
    <input type="email" ng-model="email">
    <input type="submit" valuse="追加">
  </form>
  <ul>
    <li ng-repeat="user in users">{{ user.name }} - {{ user.email }}</li>
  </ul>
</div>
```

<div class="alert alert-info">
**Tip:**
他にも `$route` サービスから初期化する方法もあります。
</div>

<div class="alert alert-info">
**Tip:**
v1.2.0 から `as propertyName` 構文がサポートされています。
`as` の後に続くキーワードを $scope のプロパティとして作成しコンストラクタの `this` を代入します。
この構文によりビューからコントローラのコンテキストに速やかにアクセスできます。
</div>

<div preview="article.examples.example" size="280"></div>
