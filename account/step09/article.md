前回のステップまでで帳票アプリは完成です。
しかし改めて完成したコードを眺めると無駄な箇所があることがわかります。

## 複数のコントローラが全く同じ機能を別々に実装している
getSubtotal メソッドと getTotalAmount メソッドが CreationController と SheetController の2箇所に存在しています。
コードの重複は無駄ですし処理に変更があった際の修正箇所も増えてしまいます。

これらのメソッドはサービスとして一箇所にまとめて実装しましょう。

```javascript
.service('counting', function () {
  this.getSubtotal = function (orderLine) {/* 省略 */};
  this.getTotalAmount = function (lines) {/* 省略 */};
})
.controller('CreationController', ['$scope', 'sheets', 'counting',
function CreationController($scope, sheets, counting) {
  // 省略

  angular.extend($scope, counting); // $scope オブジェクトに counting サービスメソッドをミックスイン

  $scope.initialize();
}])
.controller('SheetController', ['$scope', '$routeParams', 'sheets', 'counting',
function SheetController($scope, $params, sheets, counting) {
  angular.extend($scope, sheets.get($params.id));
  angular.extend($scope, counting); // counting サービスで $scope オブジェクトを拡張
}]);
```

コントローラはサービスを受け取り $scope オブジェクトにミックスインしてビューから参照できるようにします。

副次的なメリットとしてコンスタクタがインスタンス化されるときに関数を作成するコストが少なくなりました。

## コントローラのインスタンス化のコストを減らす
コントローラ関数はコンストラクタです。
マルチビューアプリケーションではコントローラはルートが変わるたびにインスタンス化されます。

コンストラクタ内で関数定義を行うとインスタンス化のたびに新しく関数を定義することになりインスタンス化の際にかかるコストが高くなります。

一方サービスは常にシングルトンであり、サービス内の関数定義はアプリケーション全体を通して一度だけしか行われません。
上記を踏まえた上で改めてコードを見れば新たに無駄な場所を発見できると思います。

CreationController 内で定義されたビジネスロジックの定義です。
これらもすべてサービスにカプセル化しコントローラ内ではミックスインするだけにしましょう。

```javascript
.service('sheetAction', ['$location', 'sheets',
function ($location, sheets) {
  function createOrderLine() {/* 省略 */}

  this.initialize = function () {/* 省略 */};
  this.addLine = function () {/* 省略 */};
  this.removeLine = function (target) {/* 省略 */};
  this.save = function () {/* 省略 */};
}])
.controller('CreationController', ['$scope',  'counting', 'sheetAction',
function CreationController($scope, counting, sheetAction) {
  angular.extend($scope, sheetAction); // $scope オブジェクトに sheetAction サービスメソッドをミックスイン
  angular.extend($scope, counting);

  $scope.initialize();
}])
```

## テンプレート内のわかりにくい部分をコントローラに移管する
テンプレート内の ngPattern ディレクティブに渡す正規表現や削除ボタンの ngDisabled ディレクティブに渡す条件式などは HTML 上では少し把握しづらいものです。
とりわけこのようなものはコメントを残しておかないと、あとで困った事になるケースも有り得ます(今回のケースでは単純な条件なのでまだ大丈夫だとは思いますが)。

わかりにくい部分はモデル化してビューにはモデルの参照だけさせるようにしましょう。

```javascript
$scope.integer = /^\d+$/; // 整数にマッチ
```
```html
<input type="number" required min="0" ng-pattern="integer" ng-model="orderLine.unitPrice">
```

このほうがわかりやすいですね。

ngDisabled ディレクティブに渡す条件はリストが更新されるたびに評価される必要があります。
もっとも単純な例は下記のやり方です。

```javascript
$scope.isDisabled = function () {
  retrun $scope.lines.length < 2;
};
```
```html
<button type="button" ng-disabled="isDisabled()">削除</button>
```

しかしこのやり方は実はあまりいい実装ではありません。
例えば100個の注文明細行をもった帳票だった場合、個別の実行結果が変わらないにもかかわらず isDisabled メソッドは100回コールされることになります。
これは恐ろしく無駄ですので他の方法で実装しましょう。

```javascript
$scope.$watch('lines.length < 2', function (val) {
  $scope.disabledDelBtn = val;
});
```
```html
<button type="button" ng-disabled="disabledDelBtn">削除</button>
```

[$watch](http://docs.angularjs.org/api/ng.$rootScope.Scope#$watch) メソッドを使いボタンを無効化する条件を監視しその結果をモデル化します。
ディレクティブは関数実行ではなくモデルを参照するだけなので要素数が増えてもパフォーマンスに与える影響が少なくてすみます。

<div class="alert alert-warning">
**Warning:**
最初の状態と比べた場合、パフォーマンスが低下する可能性があるのでメンテナンス性とパフォーマンスを秤にかける必要があります。
</div>

lines モデルや lines モデルの length プロパティを監視してもいいのですがその場合コールバック内で条件評価を行うことになります。
それは結果的に disabledDelBtn モデルの値に変化がない場合でもコールバックが実行されるケースがあることを意味するので無駄が発生してしまいます。

```javascript
$scope.$watch('lines.length', function (length) {
  // この関数は lenes.length が 4 から 5 に変化した時も呼ばれます
  // その条件では length < 2 の結果には変化がありません。
  $scope.disabledDelBtn = length < 2;
});
```
```javascript
$scope.$watch('lines.length < 2', function (val) {
  // この関数は lines.length < 2 の結果が変わった時だけ呼ばれます
  $scope.disabledDelBtn = val;
});
```

$watch を使う場合コールバック内の処理は簡潔なものにとどめましょう。
監視対象によっては開発者が思う以上にコールバックが呼ばれたり最悪の場合無限ループに陥るケースもありえます。

<div class="alert alert-info">
**Tip:**
AngularJS ではこのような無限ループ(digest ループ)はデフォルトで 10回繰り返した段階で強制的にループから抜けます。
</div>

<div preview="article.examples.example"></div>

## 完成
以上でチュートリアルは終了です。
