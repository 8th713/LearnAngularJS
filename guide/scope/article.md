## 役割
$scope オブジェクトは以下の役割を果たすために使用されるものです。

* ビューにバインドしたいデータモデルを定義する場所。
* 自身のプロパティ（つまりデータモデル）に変更があった時ビューにそれを伝える。
* ビューが式を評価する際のコンテキストの提供（つまりビューのグローバルスコープ）。
* イベントの発行とイベントリスナーの登録

## コントローラやビューとの関係
$scope はコントローラやディレクティブとビューの橋渡しを行います。
ビューは $scope を参照しデータをバインドしていきます。
コントローラやディレクティブがデータモデルを変更した時 $scope はその変更をビューに伝えてくれます。
変更を受け取ったビューは自動的に表示を更新します。

この仕組のためコントローラーはビューを全く意識せずにビジネスロジックのみに集中できます。

## ビューへの変更通知
AngularJS ではほとんどの場合においてビューへの変更通知を手動で行う必要がありません。
手動で変更通知を行わなければいけない場合の代表例は以下のとおりです。

* ディレクティブを通さずにアタッチした DOM イベントのリスナー内
* タイマーや XMLHttpRequest などの非同期処理のコールバック内

手動で更新通知を行うための手段として $scope.$apply メソッドが提供されています。

```javascript
$scope.foo = false;

setTimeout(function () {
  $scope.foo = true;
  $scope.$apply();
}, 1000);
// or
setTimeout(function () {
  // こちらのほうがベター
  $scope.$apply(function () {
    $scope.foo = true;
  });
}, 1000);
```

タイマーは $timeout サービスを、 XMLHttpRequest は $http サービスを使うことで更新を自動化できます。

<div class="alert alert-info">
**Tip:**
デバッガや console API でスタックトレースを調べて $scope.$apply が呼び出されているかどうかを確認することで手動更新が必要かどうかを判別することができます。
</div>

## 階層構造と継承
$scope は親子関係を持っており小スコープは親スコープのプロパティをプロトタイプ継承します。

アプリケーションははじめ $rootScope だけを持っています。
いくつかのディレクティブは 新規に $scope を作成するのでアプリケーションは複数の $scope を持つことになります。
新規の $scope は親 $scope の子となり DOM の構造に従ったツリー構造になります。

ビューが式を評価する時、直近の $scope のプロパティに値が発見できなかったら $rootScope に到達するまで親スコープのプロパティをたどります。

## イベント
$scope はイベントの発行とイベントリスナーの管理も行います。
イベントはいくつかのディレクティブやサービスが $scope を使って発行したりします。
もちろん自分でカスタムイベントを発行することもできます。

```javascript
// イベントリスナーの登録
$scope.$on('eventName', eventListener);

// イベント発行
// 親スコープに伝搬する
$scope.$emit('eventName', passingData, ...);

// 小スコープに伝搬する
$scope.$broadcast('eventName', passingData, ...);
```

<div preview="article.examples.demo1" size="150"></div>

## 変更時にコールバックを実行する
ビューに変更が通知される時、特定のプロパティの値が変わっていたら追加の処理を行ないたい場合があります。

$scope.$watch メソッドを使うと値が変化していた時に任意の関数を実行する事ができます。

```javascript
$scope.name = 'Alice';
$scope.$watch('name', function (newValue, oldValue, scope) {
  console.log(scope === $scope);
  console.log('name は %s から %s に変更されました', oldValue, newValue);
});

$scope.name = 'Bob';
$scope.$apply(); // 更新を通知
// => true
// => name は Alice から Bob に変更されました
```

第一引数に文字列を渡すと $scope のそのプロパティの変更を監視します。
コールバックが実行されるのはビューに変更が通知される直前で監視中のプロパティの値が変更されていたときのみです。

第一引数に関数を渡すことで $scope オブジェクトのプロパティ以外の変更も監視できます。

```javascript
var bool;
$scope.$watch(function() {
  return bool;
}, function (newValue, oldValue) {
  $scope.value = newValue;
});

bool = true;
$scope.$apply();
```

注意点として変更とはプロパティへの代入だということです。
以下の例は期待通りに動きません。

```javascript
$scope.arr = [1, 2, 3];
$scope.$watch('arr', function (newValue, oldValue) {});
$scope.arr.push(4);

$scope.obj = {value1: 1};
$scope.$watch('obj', function (newValue, oldValue) {});
$scope.obj.value2 = 2;

$scope.$apply();
```

上記例ではコールバックが受け取る newValue と oldValue は参照が同じなので `newValue === oldValue` が成り立ちます。
つまりプロパティは変更されていないということになります。

この変更を監視したい場合は $watchCollection メソッドを使います。

```javascript
$scope.arr = [1, 2, 3];
$scope.$watchCollection('arr', function (newValue, oldValue) {
  console.log(newValue);
  // => [1, 2, 3, 4]
});
$scope.arr.push(4);

$scope.obj = {value1: 1};
$scope.$watchCollection('obj', function (newValue, oldValue) {
  console.log(newValue);
  // => {value1: 1, value2: 2}
});
$scope.obj.value2 = 2;

$scope.$apply();
```

配列の要素やオブジェクトのプロパティの値に変更があった場合を監視したい時は以下のようにします。

```javascript
$scope.list = [
  {value: false}
];

$scope.$watch('list', function (newValue, oldValue) {
  // 実行されない
});

$scope.$watch('list', function (newValue, oldValue) {
  // 実行される
}, true); // 第三引数に true を渡す

$scope.$watchCollection('list', function (newValue, oldValue) {
  // 実行されない
});

$scope.list[0].value = true;
$scope.$apply();
```

第三引数を設定することで比較の仕方を参照の比較から各値を個別に比較するようになります。

<div preview="article.examples.demo2"></div>
